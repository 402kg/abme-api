import { Router } from 'express'
import { SHA512 } from 'crypto-js'

import * as sessionService from '../../security/session'
import authorize from '../../security/authorization'
import User from '../../models/user'
import { ERROR_EMAIL_NOT_FOUND, ERROR_UNAUTHORIZED } from '../../constants'

import validate from './validate'

const router = Router()

const createSession = async (request, response) => {
    const {
        email,
        password,
    } = request.body

    const user = await User.findOne({ email })
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

    if (!user) {
        return response
            .status(ERROR_EMAIL_NOT_FOUND.status)
            .end(ERROR_EMAIL_NOT_FOUND.message)
    }

    if (SHA512(password).toString() !== user.hash) {
        return response
            .status(ERROR_UNAUTHORIZED.status)
            .end(ERROR_UNAUTHORIZED.message)
    }

    const { sessions, session } = await sessionService
        .flushSessions(user, request.useragent, ip)

    user.sessions = [...sessions, session]

    await user.save()

    return response.json(session)
}

const getSessions = async (request, response) => {
    const user = await User.findOne({ uuid: request.session.uuid })
    const sessions = await sessionService.getSessions(user.sessions)

    response.json(
        sessions.map((session) => ({
            time: session.createdAt,
            useragent: session.useragent,
        })),
    )
}

router.get('/', authorize, getSessions)
router.put('/', validate.createSession, createSession)

export default router

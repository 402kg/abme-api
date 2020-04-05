import { Router } from 'express'
import { SHA512 } from 'crypto-js'

import * as sessionService from '../../security/session'
import authorize from '../../security/authorization'
import User from '../../models/user'
import mail from '../../services/mail'
import getHash from '../../utils/hash'
import config from '../../config'

import {
    ERROR_EMAIL_NOT_FOUND,
    ERROR_FORBIDDEN,
    ERROR_UNAUTHORIZED,
    FATAL_MAIL_PROVIDER,
    SUCCESS_NEW_PASSWORD,
    SUCCESS_RESET_PASSWORD,
} from '../../constants'

import limit from './limit'
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
        await response
            .status(ERROR_EMAIL_NOT_FOUND.status)
            .end(ERROR_EMAIL_NOT_FOUND.message)

        return
    }

    if (SHA512(password).toString() !== user.hash) {
        await response
            .status(ERROR_UNAUTHORIZED.status)
            .end(ERROR_UNAUTHORIZED.message)

        return
    }

    const { sessions, session } = await sessionService
        .flushSessions(user, request.useragent, ip)

    user.sessions = [...sessions, session]

    await user.save()
    response.json(session)
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

const restoreSession = async (request, response) => {
    const { email } = request.body

    const user = await User.findOne({ email })

    if (!user) {
        await response
            .status(ERROR_EMAIL_NOT_FOUND.status)
            .end(ERROR_EMAIL_NOT_FOUND.message)

        return
    }

    const token = getHash()
    const host = config.get('HOST')
    user.reset = token

    await user.save()
    try {
        await mail.send(user.email, 'Reset password link', 'reset', { token, host })
    } catch (error) {
        await response
            .status(FATAL_MAIL_PROVIDER.status)
            .end(FATAL_MAIL_PROVIDER.message)

        return
    }

    response
        .status(SUCCESS_RESET_PASSWORD.status)
        .end(SUCCESS_RESET_PASSWORD.message)
}

const setPassword = async (request, response) => {
    const token = request.headers['restore-token']
    const { password } = request.body

    if (!token || token.length < 120) {
        await response
            .status(ERROR_FORBIDDEN.status)
            .end(ERROR_FORBIDDEN.message)

        return
    }

    const user = await User.findOne({ reset: token })

    if (!user) {
        await response
            .status(ERROR_UNAUTHORIZED.status)
            .end(ERROR_UNAUTHORIZED.message)

        return
    }

    user.password = password
    user.reset = getHash()

    await user.save()

    response
        .status(SUCCESS_NEW_PASSWORD.status)
        .end(SUCCESS_NEW_PASSWORD.message)
}

router.get('/', authorize, getSessions)
router.put('/', validate.createSession, createSession)
router.put('/password', limit.resetRate, validate.setPassword, setPassword)
router.put('/restore', limit.resetRate, validate.restoreSession, restoreSession)

export default router

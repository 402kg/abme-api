import { Router } from 'express'

import authorize from '../../security/authorization'
import User from '../../models/user'
import { createSession, removeSession } from '../../security/session'
import { SAFE_USER } from '../../security/selectors'

import {
    ERROR_EMAIL_EXIST,
    ERROR_FORBIDDEN,
    SUCCESS_EMAIL_AVAILABLE,
} from '../../constants'

import limit from './limit'
import validate from './validate'

const router = Router()

const createUser = async (request, response) => {
    const {
        email,
        name,
        password,
    } = request.body

    const userDoc = await User.findOne({ email })
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

    if (userDoc) {
        await response
            .status(ERROR_EMAIL_EXIST.status)
            .end(ERROR_EMAIL_EXIST.message)

        return
    }

    const newUser = await User.create({
        email,
        name,
        password,
    })

    const session = await createSession(newUser, request.useragent, ip)
    newUser.sessions.push(session)

    await newUser.save()

    response.json(session)
}

const getUser = async (request, response) => {
    const user = await User.findOne({ uuid: request.session.uuid })
        .select(SAFE_USER)

    if (!user) {
        await removeSession(request.session.token)
        await response
            .status(ERROR_FORBIDDEN.status)
            .end(ERROR_FORBIDDEN.message)

        return
    }

    response.json(user)
}

const pingByEmail = async (request, response) => {
    const { email } = request.params

    const user = await User.findOne({ email })

    if (user) {
        await response
            .status(ERROR_EMAIL_EXIST.status)
            .end(ERROR_EMAIL_EXIST.message)

        return
    }

    response
        .status(SUCCESS_EMAIL_AVAILABLE.status)
        .end(SUCCESS_EMAIL_AVAILABLE.message)
}

router.get('/', authorize, getUser)
router.get('/ping/:email', limit.pingByEmail, pingByEmail)
router.put('/', validate.createUser, createUser)

export default router

import { Router } from 'express'

import authorize from '../../security/authorization'
import User from '../../models/user'
import { createSession, removeSession } from '../../security/session'
import { SAFE_USER } from '../../security/selectors'

import {
    ERROR_EMAIL_EXIST,
    ERROR_USERNAME_EXIST,
    ERROR_FORBIDDEN,
    SUCCESS_EMAIL_AVAILABLE,
    SUCCESS_USERNAME_AVAILABLE,
} from '../../constants'

import limit from './limit'
import validate from './validate'

const router = Router()

const createUser = async (request, response) => {
    const {
        email,
        name,
        password,
        username,
    } = request.body

    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

    const isEmailExist = await User.findOne({ email })
    const isUsernameExist = await User.findOne({ username })

    if (isEmailExist) {
        await response
            .status(ERROR_EMAIL_EXIST.status)
            .end(ERROR_EMAIL_EXIST.message)

        return
    }

    if (isUsernameExist) {
        await response
            .status(ERROR_USERNAME_EXIST.status)
            .end(ERROR_USERNAME_EXIST.message)

        return
    }

    const newUser = await User.create({
        email,
        name,
        password,
        username,
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

const pingByUsername = async (request, response) => {
    const { username } = request.params

    const user = await User.findOne({ username })

    if (user) {
        await response
            .status(ERROR_USERNAME_EXIST.status)
            .end(ERROR_USERNAME_EXIST.message)

        return
    }

    response
        .status(SUCCESS_USERNAME_AVAILABLE.status)
        .end(SUCCESS_USERNAME_AVAILABLE.message)
}

router.get('/', authorize, getUser)
router.get('/ping/email/:email', limit.pingRate, validate.pingByEmail, pingByEmail)
router.get('/ping/username/:username', limit.pingRate, validate.pingByUsername, pingByUsername)
router.put('/', validate.createUser, createUser)

export default router

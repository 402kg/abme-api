import { Router } from 'express'

import authorize from '../../security/authorization'
import User from '../../models/user'
import { createSession } from '../../security/session'
import { ERROR_EMAIL_EXIST } from '../../constants'
import { SAFE_USER } from '../../security/selectors'

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

    response.json(user)
}

router.get('/', authorize, getUser)
router.put('/', validate.createUser, createUser)

export default router

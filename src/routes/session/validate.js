import Joi from '@hapi/joi'

import { ERROR_REQUEST_VALIDATION } from '../../constants'
import validate from '../../services/validate'

async function createSession(request, response, next) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),

        password: Joi.string()
            .min(8)
            .required(),
    })

    try {
        await schema.validateAsync(request.body)
        await next()
    } catch (error) {
        const message = validate(error)

        response
            .status(ERROR_REQUEST_VALIDATION.status)
            .end(message)
    }
}

async function restoreSession(request, response, next) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
    })

    try {
        await schema.validateAsync(request.body)
        await next()
    } catch (error) {
        const message = validate(error)

        response
            .status(ERROR_REQUEST_VALIDATION.status)
            .end(message)
    }
}

async function setPassword(request, response, next) {
    const schema = Joi.object({
        password: Joi.string()
            .min(8)
            .required(),
    })

    try {
        await schema.validateAsync(request.body)
        await next()
    } catch (error) {
        const message = validate(error)

        response
            .status(ERROR_REQUEST_VALIDATION.status)
            .end(message)
    }
}

export default {
    createSession,
    restoreSession,
    setPassword,
}

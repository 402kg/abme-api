import Joi from '@hapi/joi'

import { ERROR_REQUEST_VALIDATION } from '../../constants'
import validate from '../../services/validate'

async function createUser(request, response, next) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),

        password: Joi.string()
            .min(8)
            .required(),

        name: Joi.string()
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

async function pingByEmail(request, response, next) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
    })

    try {
        await schema.validateAsync(request.params)
        await next()
    } catch (error) {
        const message = validate(error)

        response
            .status(ERROR_REQUEST_VALIDATION.status)
            .end(message)
    }
}

export default {
    createUser,
    pingByEmail,
}

import Joi from '@hapi/joi'

import User from '../../../models/user'

import RouteMiddleware from '../../../services/route'
import { handleError } from '../../../services/logger'
import { SELECT_USER } from '../../../schemas/user'

import {
    FATAL_MONGODB_PROVIDER,
} from '../../../constants'

const bodySchema = Joi.object({
    about: Joi.string(),
    links: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
        }),
    ),
    position: Joi.string(),
    projects: Joi.array().items(
        Joi.object({
            date: Joi.string(),
            description: Joi.string(),
            links: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    url: Joi.string().required(),
                }),
            ),
            name: Joi.string().required(),
            stack: Joi.array().items(
                Joi.string(),
            ),
        }),
    ),
    skills: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            props: Joi.array().items(
                Joi.string(),
            ),
        }),
    ),
})

class HandleMiddleware extends RouteMiddleware {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle({ body, session }, response) {
        try {
            const user = await User.findOneAndUpdate(
                { uuid: session.uuid },
                body,
                {
                    new: true,
                    fields: SELECT_USER,
                },
            )

            response.json(user)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_MONGODB_PROVIDER.status)
                .end(FATAL_MONGODB_PROVIDER.message)
        }
    }
}

export default new HandleMiddleware({ limit: 100, time: 10 })

import Joi from '@hapi/joi'

import User from '../../../models/user'

import RouteMiddleware from '../../../services/route'
import { handleError } from '../../../services/logger'
import { SELECT_USER } from '../../../schemas/user'

import {
    ERROR_NOT_FOUND,
    FATAL_GET_USER,
} from '../../../constants'

const paramsSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .required(),
})

class HandleMiddleware extends RouteMiddleware {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('params', paramsSchema)
    }

    async handle({ params: { username } }, response) {
        try {
            const user = await User.findOne({ username })
                .select(SELECT_USER)

            if (!user) {
                response
                    .status(ERROR_NOT_FOUND.status)
                    .end(ERROR_NOT_FOUND.message)

                return
            }

            response.json(user)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_GET_USER.status)
                .end(FATAL_GET_USER.message)
        }
    }
}

export default new HandleMiddleware({ limit: 10, time: 6 })

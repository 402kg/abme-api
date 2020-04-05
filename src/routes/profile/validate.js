import Joi from '@hapi/joi'

import validate from '../../services/validate'
import { ERROR_REQUEST_VALIDATION } from '../../constants'

const linksScheme = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
})

const skillsSchema = Joi.object({
    name: Joi.string().required(),
    props: Joi.array().items(
        Joi.string(),
    ),
})

const projectsSchema = Joi.object({
    date: Joi.string(),
    description: Joi.string(),
    links: Joi.array().items(linksScheme),
    name: Joi.string().required(),
    stack: Joi.array().items(
        Joi.string(),
    ),
})

async function createProfile(request, response, next) {
    const schema = Joi.object({
        about: Joi.string(),
        links: Joi.array().items(linksScheme),
        position: Joi.string(),
        projects: Joi.array().items(projectsSchema),
        skills: Joi.array().items(skillsSchema),
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
    createProfile,
}

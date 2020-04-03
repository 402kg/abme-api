import { Router } from 'express'

import authorize from '../../security/authorization'
import User from '../../models/user'
import { SAFE_USER } from '../../security/selectors'

import validate from './validate'

const router = Router()

const createProfile = async (request, response) => {
    const user = await User.findOneAndUpdate(
        { uuid: request.session.uuid },
        request.body,
        {
            new: true,
            fields: SAFE_USER,
        },
    )

    return response.json(user)
}

router.put('/', authorize, validate.createProfile, createProfile)

export default router

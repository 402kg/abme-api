import { ERROR_FORBIDDEN } from '../constants'

import { getSession } from './session'

const authorize = async (request, response, next) => {
    const { authorization } = request.headers

    if (!authorization || authorization.length < 120) {
        await response
            .status(ERROR_FORBIDDEN.status)
            .end(ERROR_FORBIDDEN.message)

        return
    }

    const session = await getSession(authorization)

    if (!session) {
        await response
            .status(ERROR_FORBIDDEN.status)
            .end(ERROR_FORBIDDEN.message)

        return
    }

    request.session = session

    await next()
}

export default authorize

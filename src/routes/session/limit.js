import rateLimit from 'express-rate-limit'

import { ERROR_TO_MANY_REQUESTS } from '../../constants'

const resetRate = rateLimit({
    windowMs: 6 * 1000, // 6s
    max: 10,
    message: ERROR_TO_MANY_REQUESTS.message,
    statusCode: ERROR_TO_MANY_REQUESTS.status,
})

export default {
    resetRate,
}

import { Router } from 'express'

import ErrorRoute from './error'
import SessionRoute from './session'
import StatusRoute from './status'
import UserRoute from './user'

const router = Router()

router.use('/session', SessionRoute)
router.use('/status', StatusRoute)
router.use('/user', UserRoute)
router.use('*', ErrorRoute)

export default router

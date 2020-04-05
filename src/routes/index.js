import { Router } from 'express'

import ErrorRoute from './error'
import ProfileRoute from './profile'
import SessionRoute from './session'
import StatusRoute from './status'
import UserRoute from './user'

const router = Router()

router.use('/profile', ProfileRoute)
router.use('/session', SessionRoute)
router.use('/status', StatusRoute)
router.use('/user', UserRoute)

router.use('*', ErrorRoute)

export default router

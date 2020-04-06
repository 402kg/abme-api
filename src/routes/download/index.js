import { Router } from 'express'

import getMD from './middlewares/getMD'
import getPDF from './middlewares/getPDF'

const router = Router()

router.get(
    '/md/:username',
    getMD.debounce,
    getMD.handle,
)

router.get(
    '/pdf/:username',
    getPDF.debounce,
    getPDF.handle,
)

export default router

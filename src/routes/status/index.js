import { Router } from 'express'
import moment from 'moment'

const router = Router()

const getStatus = async (request, response) => {
    response.json({
        status: 'success',
        time: moment().format(),
    })
}

router.get('/', getStatus)

export default router

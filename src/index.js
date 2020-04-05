import mongoose from './services/mongoose'
import redis from './services/redis'

import config from './config'
import server from './server'

(async function main() {
    // @prepare external services
    await mongoose()
    await redis()

    // @run application
    server.listen(config.get('PORT'))
}())

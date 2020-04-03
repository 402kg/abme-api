import bodyParser from 'body-parser'
import Express from 'express'
import http from 'http'
import morgan from 'morgan'
import useragent from 'express-useragent'

import routes from './routes'
import { handleRequest } from './services/logger'

const logger = morgan(
    ':method :url :status :response-time ms - :res[content-length]',
    { stream: handleRequest.stream },
)

const app = new Express()
const server = http.createServer(app)

app.use(logger)
app.use(bodyParser.json())
app.use(useragent.express())
app.use(routes)

export default server

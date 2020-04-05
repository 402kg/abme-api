import Mailgun from 'mailgun-js'
import path from 'path'
import pug from 'pug'

import config from '../config'

import { handleError } from './logger'

const DOMAIN = config.get('MAIL:DOMAIN')
const FROM = config.get('MAIL:FROM')
const KEY = config.get('MAIL:KEY')

const mailgun = Mailgun({
    apiKey: KEY,
    domain: DOMAIN,
    host: 'api.eu.mailgun.net',
}).messages()

function getTemplatePath(template) {
    let templatePath = null

    switch (template) {
    case 'reset':
        templatePath = path.resolve(__dirname, '../emails/resetPassword.pug')
        break

    default:
        templatePath = null
        break
    }

    return templatePath
}

async function send(to, subject, template, data = {}) {
    const templatePath = getTemplatePath(template)

    if (!templatePath) {
        handleError('Template not exist')

        return null
    }

    const html = pug.renderFile(templatePath, data)

    const payload = {
        to,
        subject,
        html,
        from: FROM,
    }

    return new Promise((resolve, reject) => {
        mailgun.send(payload, (error, body) => {
            if (error) {
                handleError(error)
                reject(error)

                return
            }

            resolve(body)
        })
    })
}

export default {
    send,
}

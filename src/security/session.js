import Promise from 'bluebird'
import moment from 'moment'
import equal from 'fast-deep-equal'

import Redis from '../services/redis'
import getHash from '../utils/hash'

export async function getSession(token) {
    const redis = await Redis()

    return new Promise((resolve, reject) => {
        redis.hgetall(token, (error, result) => {
            if (error) {
                reject(error)

                return
            }

            const payload = result && JSON.parse(result.source)

            resolve(
                payload ? { ...payload, token } : null,
            )
        })
    })
}

export async function createSession(user, useragent, ip) {
    const redis = await Redis()
    const token = getHash()

    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            ip,
            useragent,
            uuid: user.uuid,
            createdAt: moment().format(),
        })

        redis.hmset(token, ['source', payload], (error) => {
            if (error) {
                reject(error)

                return
            }

            resolve(token)
        })
    })
}

export async function getSessions(tokens) {
    return Promise.all(
        tokens.map(getSession),
    )
}

export async function removeSession(token) {
    const redis = await Redis()

    return new Promise((resolve, reject) => {
        redis.hdel(token, 'source', (error) => {
            if (error) {
                reject(error)

                return
            }

            resolve()
        })
    })
}

export async function clearSessions(tokens) {
    return Promise.all(
        tokens.map(removeSession),
    )
}

export async function flushSessions(user, useragent, ip) {
    const userSessions = await getSessions(user.sessions)

    const sessionsToRemove = userSessions.filter((session) => {
        const isUserAgentEqual = equal(session.useragent, useragent)

        return session.ip === ip && isUserAgentEqual
    })

    await clearSessions(
        sessionsToRemove.map((session) => session.token),
    )

    const sessions = user.sessions
        .filter((token) => !sessionsToRemove.find((session) => session.token === token))

    const session = await createSession(user, useragent, ip)

    return {
        sessions,
        session,
    }
}


export default { }

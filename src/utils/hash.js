import { SHA512 } from 'crypto-js'

export default function () {
    const rValue = (Math.random() * (25 ** 25))
        .toString(32)
        .replace('.', '')

    return SHA512(rValue).toString()
}

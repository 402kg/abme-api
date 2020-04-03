import { SHA512 } from 'crypto-js'

export function setPassword(value) {
    this.hash = SHA512(value).toString()
}

export default { }

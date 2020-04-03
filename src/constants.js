export const ERROR_EMAIL_EXIST = { status: 409, message: 'EMAIL TAKEN' }
export const ERROR_EMAIL_NOT_FOUND = { status: 404, message: 'EMAIL NOT FOUND' }
export const ERROR_FORBIDDEN = { status: 403, message: 'FORBIDDEN' }
export const ERROR_NOT_ALLOWED = { status: 404, message: 'NOT ALLOWED' }
export const ERROR_REQUEST_VALIDATION = { status: 400, message: 'REQUEST BODY INVALID' }
export const ERROR_TO_MANY_REQUESTS = { status: 429, message: 'TO MANY REQUESTS' }
export const ERROR_UNAUTHORIZED = { status: 401, message: 'UNAUTHORIZED' }

export const SUCCESS_EMAIL_AVAILABLE = { status: 200, message: 'EMAIL AVAILABLE' }

export default { }

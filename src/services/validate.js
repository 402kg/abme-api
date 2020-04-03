export default function (error) {
    return error.details.map((detail) => detail.message).join('\n')
}

import mongoose from 'mongoose'

export const SELECT_LINKS = `
    links.name
    links.url
`

export default new mongoose.Schema({
    name: String,
    url: String,
}, { id: false, timestamps: true })

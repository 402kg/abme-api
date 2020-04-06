import mongoose from 'mongoose'

import link from './link'

export const SELECT_PROJECTS = `
    projects.date
    projects.description
    projects.links.name
    projects.links.url
    projects.name
    projects.stack
`

export default new mongoose.Schema({
    name: String,
    date: String,
    description: String,
    links: [link],
    stack: [String],
}, { id: false, timestamps: true })

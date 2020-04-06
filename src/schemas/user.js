import mongoose from 'mongoose'
import uuid from 'shortid'

import config from '../config'
import getHash from '../services/hash'

import email, { SELECT_EMAIL } from './email'
import link, { SELECT_LINKS } from './link'
import project, { SELECT_PROJECTS } from './project'
import skill, { SELECT_SKILLS } from './skill'

export const SELECT_USER = `
    -_id
    about
    icon
    name
    position
    username
    uuid

    ${SELECT_EMAIL}
    ${SELECT_LINKS}
    ${SELECT_PROJECTS}
    ${SELECT_SKILLS}
`

export default new mongoose.Schema({
    about: String,
    name: String,
    position: String,

    links: [link],
    projects: [project],
    skills: [skill],

    icon: {
        type: String,
        default: config.get('ASSETS:ICON'),
    },

    email: {
        index: true,
        required: true,
        type: email,
    },

    hash: {
        default: getHash,
        index: true,
        type: String,
    },

    reset: {
        default: getHash,
        index: true,
        type: String,
    },

    sessions: {
        type: [String],
    },

    uuid: {
        default: uuid.generate,
        index: true,
        unique: true,
        type: String,
    },

    username: {
        index: true,
        required: true,
        unique: true,
        type: String,
    },
}, { timestamps: true, id: false })

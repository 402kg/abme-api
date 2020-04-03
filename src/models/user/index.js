import mongoose from 'mongoose'
import uuid from 'shortid'

import getRandom from '../../utils/random'

import { setPassword } from './service'

const linksSchema = new mongoose.Schema({
    name: String,
    url: String,
})

const projectsSchema = new mongoose.Schema({
    name: String,
    date: String,
    description: String,
    links: [linksSchema],
    stack: [String],
}, { timestamps: true, id: false })

const skillsSchema = new mongoose.Schema({
    name: String,
    props: [String],
}, { timestamps: true, id: false })

const userSchema = new mongoose.Schema({
    about: String,
    name: String,
    position: String,

    links: [linksSchema],
    projects: [projectsSchema],
    skills: [skillsSchema],

    uuid: {
        default: uuid.generate,
        index: true,
        unique: true,
        type: String,
    },
    email: {
        index: true,
        required: true,
        unique: true,
        type: String,
    },
    hash: {
        default: getRandom,
        index: true,
        type: String,
    },
    sessions: {
        type: [String],
    },
}, { timestamps: true, id: false })

userSchema.virtual('password').set(setPassword)

export default mongoose.model('user', userSchema)

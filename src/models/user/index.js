import mongoose from 'mongoose'
import uuid from 'shortid'

import getRandom from '../../utils/random'

import { setPassword } from './service'

const userSchema = new mongoose.Schema({
    name: String,

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

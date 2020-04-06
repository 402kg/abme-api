import mongoose from 'mongoose'

export const SELECT_SKILLS = `
    skills.name
    skills.props
`

export default new mongoose.Schema({
    name: String,
    props: [String],
}, { id: false, timestamps: true })

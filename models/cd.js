import mongoose from 'mongoose'

const cDSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true},
    name: { type: String, required: true },
    priceInCents: { type: Number, required: true },
    description: { type: String, default: 'no description'},
    isInStock: { type: Boolean, default: true, required: true }
})

export const CD = mongoose.model('CD', cDSchema)
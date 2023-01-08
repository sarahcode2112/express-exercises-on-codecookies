import mongoose from 'mongoose'

const newsItemSchema = new mongoose.Schema({
    title: { type: String, default: 'Untitled', unique: true, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true }
})

export const NewsItem = mongoose.model('NewsItem', newsItemSchema)
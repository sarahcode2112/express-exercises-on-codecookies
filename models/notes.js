import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 5
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
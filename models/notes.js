import mongoose from "mongoose";

// i guess this is all unused right now, as it was functionality from the fullstackopen tutorial that I don't need.
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
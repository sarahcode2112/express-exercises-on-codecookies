import mongoose from 'mongoose'

// defines the different properties (is that the right word?) inside the user schema
const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

// i honestly don't know what this does, i just copied it from the fullstackopen tutorial. I am yet to understand it better. 
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

// sets up the User model we can use in the 'controllers/users.js' file to construct a new user, I think
export const User = mongoose.model('User', userSchema)

// old way of doing it with require:
// module.exports = User
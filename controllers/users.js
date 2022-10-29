import bcrypt from 'bcrypt'
import express from 'express'

// tried this but it didn't seem to do anything:
// express().use(express.urlencoded({ extended: true }))

export const usersRouter = express.Router()
import { User } from '../models/user.js'

usersRouter.post('/', async (request, response) => {
    
    // takes the exact parameters of the request body, which apply to the schema we already set up
    const { username, name, password } = request.body

    // here I'm deliberately avoiding console logging the password, since that's good security practice. I tried it, and it's possible to do it.
    console.log( username, name )

    console.log("request.body.name: " + request.body.name)
    
    // checks if the username is already in the database. if so, returns an error
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    // sets up the bcrypt password stuff. saltRounds 10 is a magic number the tutorial didn't explain
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // constructs a new user from the User model, I think. passwordHash is saved, instead of password itself. That way the password is never available in the database, I think.
    const user = new User({
        username,
        name,
        passwordHash,
    })

    // await is used so that we wait until mongoose finishes saving the user, before proceeding with the response after
    const savedUser = await user.save()

    response
        .status(201).send("Thank you for your submission" + savedUser)
    
})


// was the old way using 'require'
// module.exports = usersRouter


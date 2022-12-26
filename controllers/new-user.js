import bcrypt from 'bcrypt'
import express from 'express'

export const usersRouter = express.Router()
import { User } from '../models/user.js'

// creates a new user
usersRouter.post('/', async (request, response) => {
    
    const { username, name, password } = request.body

    // I avoid console logging the password, as is good security practice.
    console.log("New user creation requested for: " + username, name )
    
    // checks if the username is already in the database.
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    // creates password (with bcrypt)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // constructs a new user in database. saves the passwordHash only, and not the password (for security).
    const user = new User({
        username,
        name,
        passwordHash,
    })

    // use await to wait until mongoose finishes saving the user, before proceeding with sending the response after.
    const savedUser = await user.save()

    response
        .status(201).send("Thank you for your submission. New user successfully created: " + savedUser)
})


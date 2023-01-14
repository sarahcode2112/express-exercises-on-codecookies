import mongoose from 'mongoose'
import { MONGODB_URI } from './app.js'

await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // try to send for one minute
    socketTimeoutMS: 60000, // Close sockets after 1 minute of no new activity
  })
    .then(() => {
      if (process.env.MONGODB_URI !== 'test') {  console.log('The database has connected. 💽') 
      }
    })
    .catch(error => console.error(error))

export const db = mongoose.connection
import mongoose from 'mongoose'
import { MONGODB_URI } from './app.js'

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      if (process.env.MONGODB_URI !== 'test') {  console.log('The database has connected. 💽') 
      }
    })
    .catch(error => console.error(error))


export const db = mongoose.connection
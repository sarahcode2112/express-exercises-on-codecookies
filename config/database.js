import mongoose from 'mongoose'
import { MONGODB_URI } from '../app.mjs'


// I realize MONGODB_URI is cleaner than process.env.MONGODB_URI below. However, I encountered errors while implementing that. I would use more time to debug that in the future:
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      if (process.env.MONGODB_URI !== 'test') {  console.log('The database has connected. 💽') 
      }
    })
    .catch(error => console.error(error))


export const db = mongoose.connection
import mongoose from 'mongoose'
import { initRoutes } from './routes/index.mjs'
import { passReq } from './middlewares/pass-req.js'
import shopRoutes from './controllers/shop.js'
import basicRoutes from './controllers/basic-pages.js'
import newsRoutes from './controllers/news.js'
import numberOfCDsSold from './config/numberOfCDsSold.js'
import { PORT } from './config/app.js'
export const MONGODB_URI = process.env.MONGODB_URI;
import './config/database.js'
import express from 'express'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import bodyParser from 'body-parser'

// I recognize there are two names for the same import below, here. With more time, I would research and fix that to make it cleaner.
// for passport user creation/login method
import UserDetails from './models/user.js'
// for passport-based user creation:
import User from './models/user.js'

// passport login dependencies:
import passport from 'passport'
import connectEnsureLogin from 'connect-ensure-login'

export const app = express()

import cors from 'cors'
import morgan from 'morgan'
import { logger } from './middlewares/logger.js'

// for jwt-based user creation and login Credit to the FullStackOpen tutorial:
import { loginRouter } from './controllers/jwt-login.js'
import { usersRouter } from './controllers/new-user.js'

import { fileController } from './controllers/upload-google.mjs'

mongoose.set('bufferCommands', false)

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))

// for testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    await console.log(`The server has started running on port ${PORT}`)
  })
}

// use ejs files for views
app.set('view engine', 'ejs')

// dependencies for Express fileUploader, according to attacomsian tutorial:
// Using localhost:8081 based on tutorial:
let corsOptions = {
  origin: "http://localhost:8081"
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

// below could be a problem. it was extended: true in my original, but in one login tutorial it's extended: false
app.use(bodyParser.urlencoded({extended: true}))

// for passport-based user-creation and login functionality:
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(morgan('dev'))

initRoutes(app)

app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: true,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }
}))

app.use('/shop', shopRoutes)
app.use(basicRoutes)
app.use(newsRoutes)

// pass request data to all pages, so data can be used when views and templates are rendering pages:
app.use('/', passReq);

app.use(logger)

// set where hrefs point (to get static assets, such as css, html, and js files):
app.use('/assets', express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// these are for the jwt login method:
// these two app.use('/api...) things have to come after all other app.use things. Especially after express.urlencoded 
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// credit to fullstackopen tutorial for this. This is unused now, but it is the next step before making some operations that check if a user is logged-in (with the jwt method), before allowing the operations to happen. I leave it here as a work-in-progress:
const getTokenFrom = request => {
  const authorization = request.get('authorization')

  console.log('authorization is ' + authorization)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// ======================== gets

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (request, response) => {
  response.send(`this page is only visible to logged-in users. Your session ID is ${request.sessionID} and your session expires in ${request.session.cookie.maxAge} 
  <a href="/">Home page</a> 
  <br></br> 
  <a href="/logout">Log Out</a> 
  <br></br>  
  <a href="/secret">Secret page for logged-in users only</a>`)
})

app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (request, response) => {
  response.json("This is a secret page")
})

app.get('/logout', function(request,response) {
  request.logout(function(err) {
  if (err) { return next(err); }
  response.redirect('/');
});
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

app.get('/login', (request, response) => {
  response.render('login')
})

app.get('/', (request, response) => {
  const numberOfCDsInStock = 40
  response.render('index', {numberOfCDsInStock: numberOfCDsInStock,
  numberOfCDsSold: numberOfCDsSold,
  publicAudioUrl: fileController.publicAudioUrl,
})
  console.log("app.mjs says publicAudioUrl is " + fileController.publicAudioUrl)
})


// ======================== posts

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(request,response) {
  console.log(request.user)
  response.redirect('/dashboard')
})

// upload locally
app.post('/upload', async(request,response) => {
  console.log(request.files.file)
  try {
    if (!request.files.file) {
      response.send({
        status: false,
        message: 'There was no file uploaded'
      })
    } else {
      let file = request.files.file

      file.mv('./uploads/' + file.name)

      response.send({
        status: true,
        message: 'File uploaded.',
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size
        }
      })
    }
  } catch (err) {
    response.status(500).send(err)
  }
})

app.post('/add-user', async (request, response) => {
  UserDetails.register({
    username: request.body.username, active: false }, request.body.password);
  response
    .status(200)
    .send(`Thank you for creating a new Admin user: ${request.body.username} <a href="/">Home page</a> 
    <br></br> )`)
})



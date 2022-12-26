// for file uploading route:
import { initRoutes } from './routes/index.mjs'
// commenting out the below line can turn on or off an await-related error, when Jest testing:
import { fileToPlay } from './helpers/audio-file-finder.js'

import { passReq } from './middlewares/pass-req.js'

import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import UserDetails from './user.js'
import session from 'express-session'
import bodyParser from 'body-parser'

// login tutorial dependencies:
import passport from 'passport'
import connectEnsureLogin from 'connect-ensure-login'

export const app = express()

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}))


if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, async () => {
    await console.log(`The server has started running on port ${process.env.PORT}`)
  })
}

// apparently i could put this above const app = express(), according to bezkoder tutorial. i wonder what else i can put above that. what's the right order?
import cors from 'cors'

import morgan from 'morgan'

import jwt from 'jsonwebtoken'

import mongoose from 'mongoose'

import { logger } from './middlewares/logger.js'

import { readablePrice } from './helpers/readable-price.js'

import User from './user.js'
// this line above used to be what is below: 
// import { User } from './models/user.js'

import { loginRouter } from './controllers/jwt-login.js'
// const loginRouter = require('.controllers/login')

// defines a router for dealing with users. Thanks to the FullStackOpen tutorial
import { usersRouter } from './controllers/new-user.js'
import { fileController } from './controllers/upload-google.mjs'

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {  console.log('💽 Database connected') 
    }
  })
  .catch(error => console.error(error))


app.set('view engine', 'ejs')


const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true},
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true },
  description: { type: String, default: 'no description'},
  isInStock: { type: Boolean, default: true, required: true }
})

const Cookie = mongoose.model('Cookie', cookieSchema)

const newsItemSchema = new mongoose.Schema({
  // I don't know if my 'untitled' thing works as envisioned, but I wanted to try it:
  title: { type: String, default: 'Untitled', unique: true, required: true },
  content: { type: String, required: true },
  date: { type: Number, required: true }
})

const NewsItem = mongoose.model('NewsItem', newsItemSchema)

const numberOfCookiesSold = 268

// Using localhost:8081 based on tutorial:
let corsOptions = {
  origin: "http://localhost:8081"
}

// dependencies for Express fileUploader, according to attacomsian tutorial.
app.use(cors(corsOptions))


app.use(bodyParser.json())
// below could be a problem. it was extended: true in my original, but in one login tutorial it's extended: false
app.use(bodyParser.urlencoded({extended: true}))
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

// passes request data to all pages, so data can be used when views and templates are rendering pages:
app.use('/', passReq);

app.use(logger)

// useful for setting where to point hrefs, to get static assets like css and js files.
app.use('/assets', express.static('public'))


app.use(express.urlencoded({ extended: true }))

app.use(express.json())

// these two app.use('/api...) things have to come after all other app.use things. Especially after the express.urlencoded thing
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)



// credit to fullstackopen tutorial for this:
const getTokenFrom = request => {
  const authorization = request.get('authorization')

  console.log('authorization is ' + authorization)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


// ======================== gets

app.get('/react', async (request, response) => {
  response.render('react')
})

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

app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40
  response.render('index', {numberOfCookiesInStock: numberOfCookiesInStock,
  nameOfPage: "Cookieshop",
  numberOfCookiesSold: 267,
  publicAudioUrl: fileController.publicAudioUrl,
  fileToPlay: fileToPlay
})
  console.log("app.mjs says publicAudioUrl is " + fileController.publicAudioUrl)
})

app.get('/news', async (request, response) => {
  try{
    const news = await NewsItem.find({}).exec()
    response.render('news/index', {
      news: news
    })
  }catch(error) {
    console.error(error)
    response.render('news/index', {
      news: []
    })
  }
})

app.get('/cookies', async (request,response) => {
  try{
    const cookies = await Cookie.find({}).exec()
    response.render('cookies/index', { 
      cookies: cookies,
      readablePrice: readablePrice
    })
  }catch(error) {
    console.error(error)
    response.render('cookies/index', {
      cookies: [],
      readablePrice: readablePrice
    })
  }
})

app.get('/cookies/new', (request, response) => {
  response.render('cookies/new')
})

app.get('/news/new', (request, response) => {
  response.render('news/new')
})

app.get('/cookies/:slug', async (request, response) => {
  try {
    const slug = request.params.slug
    const cookie = await Cookie.findOne({ slug: slug }).exec()
    if(!cookie) throw new Error('Cookie not found')

    response.render('cookies/show', {
      cookie: cookie,
      readablePrice: readablePrice
    })

  } catch(error) {
    console.error(error)
    response.status(404).send('Could not find the cookie you\'re looking for.')
  }
})

app.get('/about', (request, response) => {
  response.render('about', {numberOfCookiesSold: numberOfCookiesSold})
})

app.get('/contact', (request, response) => {
  response.render('contact')
})


// ======================== posts

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(request,response) {
  console.log(request.user)
  response.redirect('/dashboard')
})

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

app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you for your message. We will be in touch soon.')
})

app.post('/cookies', async (request, response) => {
  console.log(JSON.stringify(request.body))
  try{
    const cookie = new Cookie({
      slug: request.body.slug,
      name: request.body.name,
      priceInCents: request.body.priceInCents
    })
    await cookie.save()

    response.send('Cookie Created')
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})

app.post('/news', async (request, response) => {
  try{
    const newsItem = new NewsItem({
      title: request.body.title,
      content: request.body.content,
      date: request.body.date
    })
    await newsItem.save()

    response.send('News Item Created')
  }catch (error) {
    console.error(error)
    response.send('Error: The news item could not be created.')
  }
})

app.post('/add-cookies', (request, response) => {
  console.log("Cookie form submission: ", request.body)
  response
    .status(200)
    .json({"Thank you for your cookie submission. It is copied here": request.body})
})

app.post('/add-user', async (request, response) => {
  UserDetails.register({
    username: request.body.username, active: false }, request.body.password);
  response
    .status(200)
    .send("Thank you for creating a new user, " + request.body.username)
})
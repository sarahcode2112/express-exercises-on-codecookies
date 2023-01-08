import { initRoutes } from './routes/index.mjs'
import { passReq } from './middlewares/pass-req.js'
import { body, validationResult } from 'express-validator'
import 'dotenv/config'
import express from 'express'
import fileUpload from 'express-fileupload'
import UserDetails from './user.js'
import session from 'express-session'
import bodyParser from 'body-parser'
import { titleCase } from './helpers/title-case.js'

// login tutorial dependencies:
import passport from 'passport'
import connectEnsureLogin from 'connect-ensure-login'

export const app = express()

import cors from 'cors'
import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { logger } from './middlewares/logger.js'
import { readablePrice } from './helpers/readable-price.js'
import { CD } from './models/cd.js'
import { NewsItem } from './models/news.js'
import User from './user.js'
// this line above used to be what is below: 
// import { User } from './models/user.js'
import { loginRouter } from './controllers/jwt-login.js'
// defines a router for dealing with users. Thanks to the FullStackOpen tutorial
import { usersRouter } from './controllers/new-user.js'
import { fileController } from './controllers/upload-google.mjs'

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

const numberOfCDsSold = 268

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

app.get('/login', (request, response) => {
  response.render('login')
})

app.get('/', (request, response) => {
  const numberOfCDsInStock = 40
  response.render('index', {numberOfCDsInStock: numberOfCDsInStock,
  numberOfCDsSold: 267,
  publicAudioUrl: fileController.publicAudioUrl,
})
  console.log("app.mjs says publicAudioUrl is " + fileController.publicAudioUrl)
})

app.get('/news', async (request, response) => {
  try{
    const news = await NewsItem.find({}).exec()
    response.render('news/index', {
      news: news,
      titleCase: titleCase
    })
  }catch(error) {
    console.error(error)
    response.render('news/index', {
      news: []
    })
  }
})

app.get('/shop', async (request,response) => {
  try{
    const cDs = await CD.find({}).exec()
    response.render('shop/index', { 
      cDs: cDs,
      readablePrice: readablePrice
    })
  }catch(error) {
    console.error(error)
    response.render('shop/index', {
      cDs: [],
      readablePrice: readablePrice
    })
  }
})

app.get('/shop/new', (request, response) => {
  response.render('shop/new')
})

app.get('/news/new', (request, response) => {
  response.render('news/new')
})

app.get('/shop/:slug', async (request, response) => {
  try {
    const slug = request.params.slug
    const cD = await CD.findOne({ slug: slug }).exec()
    if(!cD) throw new Error('CD not found')

    response.render('shop/show', {
      cD: cD,
      readablePrice: readablePrice
    })

  } catch(error) {
    console.error(error)
    response.status(404).send('We could not find the CD you\'re seeking.')
  }
})

app.get('/shop/:slug/edit', async (request, response) => {
  try {
    const slug = request.params.slug
    const cD = await CD.findOne({ slug: slug }).exec()
    if(!cD) throw new Error('CD not found')

    response.render('shop/edit', { cD: cD })
  }catch(error) {
    console.error(error)
    response.status(404).send('We could not find the CD you\'re seeking.')
  }
})

app.get('/shop/:slug/delete', async (request, response) => {
  try {
    await CD.findOneAndDelete({ slug: request.params.slug })
    
    response.redirect('/shop')
  }catch (error) {
    console.error(error)
    response.send('Error: No CD was deleted. It may be because the slug did not match a CD in our database.')
  }
})

app.get('/about', (request, response) => {
  response.render('about', {numberOfCDsSold: numberOfCDsSold})
})

app.get('/contact', (request, response) => {
  response.render('contact')
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

app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you very much for your message. We will get back to you in the order that messages were received.')
})

app.post(
  '/shop', 
  body('name').isString().isLength({ max: 150 }).escape().trim(),
  body('slug').isString().isLength({ max: 150 }).isSlug().escape().trim(),
  body('priceInCents').isInt(),
  async (request, response) => {
    console.log(JSON.stringify(request.body))

    try{
      validationResult(request).throw()

      console.log(request.body.description)
      
      const cD = new CD({
        slug: request.body.slug,
        name: request.body.name,
        description: request.body.description,
        priceInCents: request.body.priceInCents
      })
      await cD.save()

      response.send(`CD Created. You can view <a href="/shop/${request.body.slug}"> its new webpage </a>.`)
    }catch (error) {
      console.error(error)
      response.send('Error: Unable to create your CD. (It may be because the inputs did not pass validation.)')
    }
})

app.post('/shop/:slug', async (request, response) => {
  try {
    const cD = await CD.findOneAndUpdate(
      { slug: request.params.slug }, 
      request.body,
      { new: true }
    )
    
    response.redirect(`/shop/${cD.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The CD could not be edited.')
  }
})

app.post(
  '/news', 
  body('title').isString().isLength({ max: 150 }).escape().trim(),
  body('content').isString().isLength({ max: 150000 }).isSlug().escape().trim(),
  body('date').isLength({ max: 50 }).escape().trim(),
  async (request, response) => {
    console.log(JSON.stringify(request.body))

    try{
      validationResult(request).throw()

      const newsItem = new NewsItem({
        title: request.body.title,
        content: request.body.content,
        date: request.body.date
      })
      await newsItem.save()

      response.send('News Item Created')
    }catch (error) {
      console.error(error)
      response.send('Error: The news item could not be created. It may be because the inputs did not pass validation.')
    }
})

// seems unecessary
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
import 'dotenv/config'
import express from 'express'
const app = express()

import jwt from 'jsonwebtoken'

import mongoose from 'mongoose'

import { logger } from './middlewares/logger.js'

import { readablePrice } from './helpers/cookie-views.js'

import { User } from './models/user.js'



import { loginRouter } from './controllers/login.js'
// const loginRouter = require('.controllers/login')

// defines a router for dealing with users. Thanks to the FullStackOpen tutorial
import { usersRouter } from './controllers/users.js'



mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.set('view engine', 'ejs')


// this is from the fullstackopen tutoria. I could still understand it better:
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true},
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true },
  isInStock: { type: Boolean, default: true, required: true }
})

const Cookie = mongoose.model('Cookie', cookieSchema)

const newsItemSchema = new mongoose.Schema({
  // I don't know if my 'untitled' thing works as envisioned, but I wanted to try it:
  title: { type: String, default: 'Untitled',unique: true, required: true },
  content: { type: String, required: true },
  date: { type: Number, required: true }
})

const NewsItem = mongoose.model('NewsItem', newsItemSchema)

const numberOfCookiesSold = 268




app.use(logger)

// this would keep things simpler, no need to rename everything '/assets':
// app.use(express.static('public'));
app.use('/assets', express.static('public'))


app.use(express.urlencoded({ extended: true }))

app.use(express.json())


// i had to do lots of troubleshooting until I realized that these two app.use('/api...) things have to come after all other app.use things. Especially the express.urlencoded thing
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)



app.listen(process.env.PORT, () => {
  console.log(`The server has started running on port ${process.env.PORT}`)
})



// ======================== gets

app.get('/secret', async (request, response) => {
  const token = getTokenFrom(request)
  
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }




  response.json("this page is only visible to logged-in users")
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40

  response.render('index', {numberOfCookiesInStock: numberOfCookiesInStock,
  nameOfPage: "Cookieshop",
  numberOfCookiesSold: 267
})

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

}catch(error) {
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


// ======================== APIs

app.get('/api/v1/cookies', (request, response) => {
  response.json(cookies)
})

app.get('/api/v1/cookies/:slug', (request, response) => {
  const cookieId = request.params.slug

  console.log(cookieId)

  cookies.forEach((element) => 
  { 
    console.log(element)

    console.log(element.slug)
    
    if (element.slug === cookieId) {
      response.json(element)

    
    }
  })

  response
    .status(404)
    .send("404 Error: That cookie is not in our list.")
})



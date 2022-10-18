import express from 'express'
import mongoose from 'mongoose'

import { logger } from './middlewares/logger.js'

import { readablePrice } from './helpers/cookie-views.js'

const app = express()
const PORT = 3000

mongoose.connect('mongodb://127.0.0.1:27017/cookieshop')
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.set('view engine', 'ejs')

const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true},
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true },
  isInStock: { type: Boolean, default: true, required: true }
})

const Cookie = mongoose.model('Cookie', cookieSchema)

const newsItemSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  content: { type: String, required: true },
  date: { type: Number, required: true }
})

const NewsItem = mongoose.model('NewsItem', newsItemSchema)

const numberOfCookiesSold = 268

const cookies = [
  { "slug": 'chocolate-chip',
  "name": 'Chocolate Chip',
  "description": 'Chocolatey',
  "priceInCents": 350, isInStock: true },
  { "slug": 'banana',
  "name": 'Banana',
  "description": 'Tastes like bananas', 
  "priceInCents": 300, isInStock: false }
]

app.use(logger)

// this would keep things simpler, no need to rename everything '/assets':
// app.use(express.static('public'));
app.use('/assets', express.static('public'))


app.use(express.urlencoded({ extended: true }))

app.use(express.json())


app.listen(PORT, () => {
  console.log("The server has started running.")
})



// ======================== gets

app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40

  response.render('index', {numberOfCookiesInStock: numberOfCookiesInStock,
  nameOfPage: "Cookieshop",
  numberOfCookiesSold: 267
})

})

app.get('/cookies', (request,response) => {

  response.render('cookies/index', { 
    cookies: cookies,
    readablePrice: readablePrice
  })
})

app.get('/cookies/:slug', (request, response) => {
  const slug = request.params.slug

  cookies.forEach((element) => 
  
  {
  
    if (element.slug === slug) {
    response.render('cookies/show', {requestedCookie: element.name,
    description: element.description,
    price: element.priceInCents,
    readablePrice: readablePrice})
  }
}
  
)

response
    .status(404)
    .send("404 Error: Our database does not include that cookie.")
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



import express from 'express'

import { logger } from './middlewares/logger.js'

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')

const planets = ['Mars', 'Pluto', 'Venus']

const cookies = [
  { "slug": 'Chocolate Chip',
  "name": 'Chocolate Chip',
  "description": 'Chocolatey', 
  "price": 3.50 },
  { "slug": 'Banana',
  "name": 'Banana',
  "description": 'Tastes like bananas', 
  "price": 3.00 }
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

  // old:
  // response.send(cookies)

})

app.get('/cookies', (request,response) => {

  response.render('cookies/cookies')

  
  // old:
  // console.log(request.query)

  // older version without template literal format
  // response.send('<h1>Cookies</h1><p>Here, you will find all the cookies!</p>')


  // the oldest version:
  // response.send('Here you soon find all my cookies!')
})

app.get('/template-literal-HTML-example', (request,response) => {
  response.send(`
      <h1>Cookies</h1>
      <p>Here, you will find the names of all the cookies!</p>
      <ul>
        <li>${cookies[0].name}</li>
        <li>${cookies[1].name}</li>
      </ul>
    `
    )
  })

app.get('/planets/:slug', (request, response) => {
  const planetId = request.params.slug

  if (planets.includes(planetId)) {
    response.send("The planet selected is " + planetId)
  } else {
    response.send("That is not a planet in the list.")
  }
})

app.get('/about', (request, response) => {
  response.send(`
  <h1>About</h1>
  <p>Here you find the About page.</p>
  `)
})

app.get('/contact', (request, response) => {
  response.send(`
  <h1>Contact</h1>
  <p>Here you find the Contact page.</p>
  `)
})

app.get('/cookies/:slug', (request, response) => {
  const slug = request.params.slug

  response.send(`
  <h1>Your requested cookie is:</h1>
  <p>${slug}</p><br />
  <p>This page does not check if your requested cookie matched the cookie list. To do that, you can use the API route instead. Paste this as the URL, but replace 'slug' with your requested cookie: http://localhost:3000/api/v1/cookies/slug</p>
  `)
})



app.get('/search', (request, response) => {
  const queryString = request.query 
  // the above could also say request.queryString, and then the request would look like a string, not like an object

  console.log(request.query)

  response.json({'You searched for ':  queryString})
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

    // another old way I did first:
    // response.send("The cookie selected is " + cookieId)
    }
  })

  response
    .status(404)
    .send("404 Error: That cookie is not in our list.")
})



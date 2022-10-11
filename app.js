import express from 'express'

import { logger } from './middlewares/logger.js'

const app = express()
const PORT = 3000

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

app.use('/assets', express.static('public'))

app.use(express.urlencoded({ extended: true }))

// this would keep things simpler, no need to rename everything '/assets':
// app.use(express.static('public'));

app.listen(PORT, () => {
  console.log("The server has started running.")
})


// app.get('/', (request, response) => {
//   response.send("This is a test")
// })


app.get('/', (request, response) => {
  response.send(cookies)

  // old:
  // response.send(planets)

})


// ======================== gets

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

app.get('/cookies', (request,response) => {
  console.log(request.query)

  response.send(`
    <h1>Cookies</h1>
    <p>Here, you will find the names of all the cookies!</p>
    <ul>
      <li>${cookies[0].name}</li>
      <li>${cookies[1].name}</li>
    </ul>
  `)

  // old version without template literal format
  // response.send('<h1>Cookies</h1><p>Here, you will find all the cookies!</p>')

  // an old version, with a status code:
  // response
  //   .status(200)
  //   .send('Here you find all the cookies.')

  // the oldest version:
  // response.send('Here you soon find all my cookies!')
})

app.get('/search', (request, response) => {
  const queryString = request.queryString 
  // the above could also say request.query, and then the request would look like an object, not like a string

  response.send('You searched for: ' + queryString)
})


// ======================== posts

app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you for your message. We will be in touch soon.')
})


app.post('/add-cookies', (request, response) => {
  console.log("Cookie form submission: ", request.body)
  response.send('Thank you for your submission. It is copied below:', '\n', request.body)
  // I could not get the above to work with sending the request.body. it would throw an error
})


// ======================== APIs

app.get('/api/v1/cookies', (request, response) => {
  response.json(cookies)

  // old way:
  // response.json({
  //   cookies: [
  //     { name: 'Chocolate Chip', price: 3.50 },
  //     { name: 'Banana', price: 3.00 }
  //   ]
  // })
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

  response.send("That cookie is not in our list.")
})



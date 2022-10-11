import express from 'express'

import { logger } from './middlewares/logger.js'

const app = express()
const PORT = 3000

const planets = ['Mars', 'Pluto', 'Venus']

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
  response.send(planets)
})


app.get('/planets/:slug', (request, response) => {
  const planetId = request.params.slug

  if (planets.includes(planetId)) {
    response.send("The planet selected is " + planetId)
  } else {
    response.send("That is not a planet in the list.")
  }
})


app.get('/cookies', (request,response) => {
  console.log(request.query)

  response.send('Here you soon find all my cookies!')
})



app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you for your message. We will be in touch soon.')
})


app.post('/add-cookies', (request, response) => {
  console.log("Cookie form submission: ", request.body)
  response.send('Thank you for your submission. It is copied below:', '\n', request.body)
  // I could not get the above to work with sending the request.body. it would throw an error
})


app.get('/search', (request, response) => {
  const queryString = request.queryString 
  // the above could also be request.query, and then the request would look like an object, not like a string

  response.send('You searched for: ' + queryString)
})
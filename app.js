import express from 'express'

import { logger } from './logger.js'

const app = express()
const PORT = 3000

const planets = ['Mars', 'Pluto', 'Venus']

app.use(logger)

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
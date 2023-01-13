import { Router } from 'express'
import { passReq } from '../middlewares/pass-req.js'
import { readablePrice } from '../helpers/readable-price.js'

const router = Router()
router.use('/', passReq);

app.get('/about', (request, response) => {
    response.render('about', {numberOfCDsSold: numberOfCDsSold})
  })
  
  app.get('/contact', (request, response) => {
    response.render('contact')
  })
import { Router } from 'express'
import { passReq } from '../middlewares/pass-req.js'
import numberOfCDsSold from '../config/numberOfCDsSold.js'

const router = Router()
router.use('/', passReq);

router.get('/about', (request, response) => {
  response.render('about', {numberOfCDsSold: numberOfCDsSold})
})
  
router.get('/contact', (request, response) => {
  response.render('contact')
})

router.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you very much for your message. We will get back to you in the order that messages were received.')
})

export default router
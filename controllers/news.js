import { Router } from 'express'
import { passReq } from '../middlewares/pass-req.js'
import { body, validationResult } from 'express-validator'
import { NewsItem } from '../models/news.js'
import { titleCase } from '../helpers/title-case.js'

const router = Router()
router.use('/', passReq);

// to do
router.get('/news', async (request, response) => {
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

router.get('/news/new', (request, response) => {
  response.render('news/new')
})


// the validation error messages don't show up yet in the UI, but they're here as a work-in-progress for a future version of the project:
router.post(
  '/news', 
  body('title').isString().isLength({ max: 300 }).escape().trim()
    .withMessage('Did not receive a valid title less than 300 characters'),
  body('content').isString().isLength({ max: 150000 }).isSlug().escape().trim()
    .withMessage('Did not receive content of string type less than 15000 characters.'),
  body('date').isDate().escape().trim()
    .withMessage('Did not receive a valid date'),
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

      response.send(`News Item Created. Back to <a href="/news">News page</a>`)
    }catch (error) {
      console.error(error)
      response.send('Error: The news item could not be created. It may be because the inputs did not pass validation, or because the same title already exists.')
    }
})

export default router
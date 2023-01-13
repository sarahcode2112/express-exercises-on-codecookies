import { Router } from 'express'
import { passReq } from '../middlewares/pass-req.js'
import { body, validationResult } from 'express-validator'
import { CD } from '../models/cd.js'
import { readablePrice } from '../helpers/readable-price.js'

const router = Router()
router.use('/', passReq);

router.get('/', async (request,response) => {
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

router.get('/new', (request, response) => {
    if (request.isAuthenticated()) {
    response.render('shop/new')} else {
    response.send('Sorry, you\'re not logged in as an admin, so you cannot view this page.')
    }
})

router.get('/:slug', async (request, response) => {
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

router.get('/:slug/edit', async (request, response) => {
    if (request.isAuthenticated()) {
    try {
        const slug = request.params.slug
        const cD = await CD.findOne({ slug: slug }).exec()
        if(!cD) throw new Error('CD not found')

        response.render('shop/edit', { cD: cD })
    }catch(error) {
        console.error(error)
        response.status(404).send('We could not find the CD you\'re seeking.')
    }
    } else {
        response.send('Sorry, you\'re not logged in as an admin, so you cannot view this page.')
    }
})

router.get('/:slug/delete', async (request, response) => {
    try {
        await CD.findOneAndDelete({ slug: request.params.slug })

        response.redirect('/shop')
    }catch (error) {
        console.error(error)
        response.send('Error: No CD was deleted. It may be because the slug did not match a CD in our database.')
    }
})

router.post(
  '/', 
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

router.post('/:slug', async (request, response) => {
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

export default router
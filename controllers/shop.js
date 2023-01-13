import { Router } from 'express'
import { passReq } from '../middlewares/pass-req.js'
import { CD } from '../models/cd.js'
import { readablePrice } from '../helpers/readable-price.js'

const router = Router()
router.use('/', passReq);

router.get('/shop', async (request,response) => {
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

router.get('/shop/new', (request, response) => {
    if (request.isAuthenticated()) {
    response.render('shop/new')} else {
    response.send('Sorry, you\'re not logged in as an admin, so you cannot view this page.')
    }
})

router.get('/shop/:slug', async (request, response) => {
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

router.get('/shop/:slug/edit', async (request, response) => {
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

router.get('/shop/:slug/delete', async (request, response) => {
    try {
        await CD.findOneAndDelete({ slug: request.params.slug })

        response.redirect('/shop')
    }catch (error) {
        console.error(error)
        response.send('Error: No CD was deleted. It may be because the slug did not match a CD in our database.')
    }
})

export default router
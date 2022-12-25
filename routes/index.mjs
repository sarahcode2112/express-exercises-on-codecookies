import express from 'express'
const router = express.Router()
import { upload } from '../controllers/file.controller.mjs'

// this thing below could include multiple routes like a list of routes, as bezkoder tutorial shows
export let initRoutes = (app) => {
    router.post("/upload2", upload)

    app.use(router)
}


import express from 'express'
const router = express.Router()
import { fileController } from '../controllers/upload-google.mjs'

export let initRoutes = (app) => {
    router.post("/upload2", fileController.upload)

    app.use(router)
}


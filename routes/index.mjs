import express from 'express'
const router = express.Router()
import { fileController } from '../controllers/file.controller.mjs'

export let initRoutes = (app) => {
    router.post("/upload2", fileController.upload)

    app.use(router)
}


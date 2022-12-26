import { app } from '../app.mjs'
import supertest from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { request } from 'http'






describe('Test banana route', () => {
    let server

    beforeEach(() => {
        server = app.listen(3000)
        // const app = express()
    })

    afterAll(() => {
        server.close()
        mongoose.connection.close()
    })

    test('It should return an error', async () => {
        const response = await supertest(app).get('/cookies/banana')
        expect(response.statusCode).toBe(404)

        // return await supertest(app)
        //     .get('/')
        //     .then(response => {
        //         expect(response.text).toContain('Cookieshop')
        //     })
    })
})
            
    
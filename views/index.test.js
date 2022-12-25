import { app } from '../app'
import supertest from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { request } from 'http'



describe('Test the banana page', () => {
    // let server

    beforeEach(() => {
        jest.resetModules();
        // const app = express()
        // server = app.listen(3000)
    })

    afterEach(() => {
        server.close()
        mongoose.connection.close()
    })

    test('It should return an error', async () => {

        const response = await request(app).get('/cookies/banana')
        expect(response.statusCode).toBe(404)

        // return await supertest(app)
        //     .get('/')
        //     .then(response => {
        //         expect(response.text).toContain('Cookieshop')
        //     })
    })
})
            
    
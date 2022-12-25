import { app } from '../app.mjs'
import supertest from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { request } from 'http'






describe('Test banana route', () => {
    let server

    beforeEach(() => {
        jest.resetModules();
        server = app.listen(3000)
        server.close()
        // const app = express()
        
    })

    afterEach(() => {
        server.close()
        mongoose.connection.close()
    })

    test('It should return an error', async () => {
        
        debugger
        
        const response = await request(app).get('/cookies/banana')
        expect(response.statusCode).toBe(404)

        // return await supertest(app)
        //     .get('/')
        //     .then(response => {
        //         expect(response.text).toContain('Cookieshop')
        //     })
    })
})
            
    
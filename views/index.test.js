import { app } from '../app'
import supertest from 'supertest'
import express from 'express'
import mongoose from 'mongoose'



// describe('My Test Suite', () => {
//     let server

//     beforeEach(() => {
//         const app = express()
//         server = app.listen(3000)
//     })

//     afterEach(() => {
//         server.close()
//         mongoose.connection.close()
//     })

//     test('Unit test for index page', async () => {
//         return await supertest(app)
//             .get('/')
//             .then(response => {
//                 expect(response.text).toContain('Cookieshop')
//             })
//     })
// })
            
    
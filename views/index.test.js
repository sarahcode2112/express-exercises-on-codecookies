import { app } from '../app'

import { request } from "node:http"
import { hasUncaughtExceptionCaptureCallback } from "node:process"
// import { it } from "node:test"






describe('Unit test for index page', function() {

    it('should contain the word Cookieshop', function() {
        return request(app)
            .get('/')
            .then(function(response){
                hasUncaughtExceptionCaptureCallback(response.text).to.contain('Cookieshop')
            })
    })

})
export const logger = (request, response, next) => {
  console.log(
    "Request from",
    new Date().toUTCString(),
    
    request.ip
  )
  next()

}
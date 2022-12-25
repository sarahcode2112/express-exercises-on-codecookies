export const logger = (request, response, next) => {
  console.log(
    "Logger: Request from",
    new Date().toUTCString(),
    request.ip
  )
  next()

}
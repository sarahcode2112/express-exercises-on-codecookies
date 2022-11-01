export const logger = (request, response, next) => {
  console.log(
    "Logger says: Request from",
    new Date().toUTCString(),
    request.ip
  )
  next()

}
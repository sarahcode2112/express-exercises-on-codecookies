export const logger = (request, response, next) => {
  console.log(
    "Logger: Request from",
    // date and time request was received:
    new Date().toUTCString(),
    // IP address of client:
    request.ip
  )
  next()
}
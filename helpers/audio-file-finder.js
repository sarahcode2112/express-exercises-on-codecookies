import { storage } from "../controllers/file.controller.js"

const bucket = storage.bucket("music-self-recording-file-uploads")
const files = await bucket.getFiles()

// console.log(files)

const deleteableFolderName = 'deleteable'

console.log(files[0].filter(f => f.id.includes(deleteableFolderName + '%2F')))

export const fileToPlay = files[0].filter(f => f.id.includes(deleteableFolderName + '%2F'))[0]

console.log(fileToPlay.metadata.selfLink)
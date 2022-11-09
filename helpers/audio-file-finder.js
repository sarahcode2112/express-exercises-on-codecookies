import { storage } from "../controllers/file.controller.js"

const bucket = storage.bucket("music-self-recording-file-uploads")

// new stuff I just tried, which maybe breaks something:
const getFiles = async () => {
    let files
    files = await bucket.getFiles()
    return files
}

const files = getFiles()
files.then( ()=> 
    console.log(files) 
)


// old way from when it didn't break
// const files = await bucket.getFiles()

console.log(files)

const deleteableFolderName = 'deleteable'

console.log("deleteable files are " + files[0].filter(f => f.id.includes(deleteableFolderName + '%2F')))

export const fileToPlay = files[0].filter(f => f.id.includes(deleteableFolderName + '%2F'))[0]

console.log("fileToPlay is " + fileToPlay.metadata.selfLink)
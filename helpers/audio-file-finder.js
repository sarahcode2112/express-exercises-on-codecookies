import { storage } from "../controllers/file.controller.js"

const bucket = storage.bucket("music-self-recording-file-uploads")

// new stuff I just tried, which maybe breaks something:
const getFiles = async () => {
    let files
    files = await bucket.getFiles()
    return files
}


const main = async () => { 

    const files = await getFiles()

    const deleteableFolderName = 'deleteable'

    // console.log("deleteable files are " + files[0].filter(f => f.id.includes(deleteableFolderName + '%2F')))

    const fileToPlay = files[0].filter(f => f.id.includes(deleteableFolderName + '%2F'))[0]

    // console.log("fileToPlay is " + fileToPlay.metadata.selfLink)

    return fileToPlay
}

const fileToPlayPromise = main()

export let fileToPlay

fileToPlayPromise.then((fileToPlayValue) => {
    fileToPlay = fileToPlayValue
})


import { processFileMiddleware } from "../middlewares/upload.js"

import { format } from "util"
import { Storage } from "@google-cloud/storage"

const storage = new Storage({ keyFilename: "google-cloud-key.json" })

const bucket = storage.bucket("music-self-recording-file-uploads")


const upload = async (request, response) => {
    console.log(request.file)
    try {
        await processFileMiddleware(request, response)

        console.log(request.file)

        // not sure if request.file is right here, or request.files.file or something like that.
        if (!request.file) {
            return response.status(400).send({ message: "No file available to upload." })
        }


        const blob = bucket.file(request.file.originalname)
        const blobStream = blob.createWriteStream({ 
            resumable: false
        })

        blobStream.on("error", (err) => {
            response.status(500).send({ message: err.message })
        })

        // this makes a url that can be used to directly access the uploaded file
        blobStream.on("finish", async (data) => {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            )

            // here makes the file public. but i don't know if that's actually necessary for my project
            try {
                await bucket.file(request.file.originalname).makePublic()
            } catch {
                return response.status(500).send({
                    message: 
                        `File upload worked for ${request.file}, but public access did not work.`,
                    url: publicUrl
                })
            }

            response.status(200).send({
                message: "Upload successful of " + request.file,
                url: publicUrl
            })
        })

        blobStream.end(request.file.buffer)
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return response.status(500).send({
                message: "File size limit is 3MB."
            })
        }

        response.status(500).send({
            message: `Unable to upload file ${request.file}. ${err}`
        })
    }
}

const getListFiles = async (request, response) => {

}

const download = async (request, response) => {

}

export {
    upload,
    getListFiles,
    download
}
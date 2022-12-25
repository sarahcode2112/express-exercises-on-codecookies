import { processFileMiddleware } from "../middlewares/upload.js"
import { format } from "util"
import { Storage } from "@google-cloud/storage"

export const storage = new Storage({ keyFilename: "google-cloud-key.json" })

const bucket = storage.bucket("music-self-recording-file-uploads")

const upload = async (request, response) => {
    try {
        await processFileMiddleware(request, response)

        console.log(request.file)

        if (!request.file) {
            return response.status(400).send({ message: "No file available to upload." })
        }

        // deletes previous files, so that user can only have one uploaded file in the database at a time. must use '%2F' instead of '/' to make it work.
        const deleteableFolderName = 'deleteable'
        const files = await bucket.getFiles()
        console.log(files)
        const deleteableFiles = files[0].filter(f => f.id.includes(deleteableFolderName + '%2F'))
        deleteableFiles.forEach(async file => {
            await file.delete()
        })

        const blob = bucket.file('deleteable/' + request.file.originalname)
        const blobStream = blob.createWriteStream({ 
            resumable: false
        })

        blobStream.on("error", (err) => {
            response.status(500).send({ message: err.message })
        })

        // makes a url that can be used to directly access the uploaded file
        blobStream.on("finish", async (data) => {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            )

            // makes the file public.  may be unnecessary for my project.
            try {
                await bucket.file('deleteable/' + request.file.originalname).makePublic()
            } catch {
                return response.status(500).send({
                    message: 
                        `File upload worked for ${request.file}, but public access did not work.`,
                    url: publicUrl
                })
            }
            
            response.status(200).send({
                message: "Upload successful of " + request.file.fieldname,
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
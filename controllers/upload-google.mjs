import { processFileMiddleware } from "../middlewares/upload.js"
import { format } from "util"
import { Storage } from "@google-cloud/storage"

export const storage = new Storage({ keyFilename: "google-cloud-key.json" })

const bucket = storage.bucket("music-self-recording-file-uploads")

const fileController = { 

    upload: async (request, response) => {
    // Because the URL variable's assignment is built into this upload function: the URL of the file is only defined after the user first uploads an audio file.
    try {
        await processFileMiddleware(request, response)

        console.log("upload-google says file uploaded's original name is: " + request.file.originalname)

        if (!request.file) {
            return response.status(400).send({ message: "No file available to upload." })
        }

        // deletes previous files, so that user can only have one uploaded file in the database at a time. must use '%2F' instead of '/' to make it work.
        const deleteableFolderName = 'deleteable'
        const files = await bucket.getFiles()

        const deleteableFiles = files[0].filter(f => f.id.includes(deleteableFolderName + '%2F'))

        deleteableFiles.forEach(async file => {
            await file.delete()
        })

        // writes the file to the right place in google cloud bucket
        const blob = bucket.file('deleteable/' + request.file.originalname)
        const blobStream = blob.createWriteStream({ 
            resumable: false
        })

        blobStream.on("error", (err) => {
            response.status(500).send({ message: err.message })
        })

        // makes a url that can be used to directly access the uploaded file
        blobStream.on("finish", async (data) => {
            const publicAudioUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            fileController.publicAudioUrl = publicAudioUrl;

            // makes the file publicly accessible. necessary for my project, so the user can access it through its URL.
            try {
                await bucket.file('deleteable/' + request.file.originalname).makePublic()
            } catch {
                return response.status(500).send({
                    message: 
                        `File upload worked for ${request.file}, but public access did not work.`,
                    url: publicAudioUrl
                })
            }
            
            response.status(200).send({
                message: "Upload successful of " + request.file.fieldname,
                url: publicAudioUrl
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
}

export {
    fileController
}
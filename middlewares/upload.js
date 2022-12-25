import util from "util"
import Multer from "multer"
// 5mb max upload size:
const maxSize = 5 * 1024 * 1024 

let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize }
}).single("audiofile.mp3")

export let processFileMiddleware = util.promisify(processFile)


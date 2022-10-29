import util from "util"
import Multer from "multer"
const maxSize = 5 * 1024 * 1024

let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize }
}).single("file")

// I hope this works. I don't quite remember how to export correctly. Changed it from the tutorial code:
export let processFileMiddleware = util.promisify(processFile)


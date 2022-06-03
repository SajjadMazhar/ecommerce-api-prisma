const multer = require("multer")

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "public/uploads")
        console.log("dest")
    },
    filename:(req, file,cb)=>{
        uniquiPrefix = Date.now() + '-' + Math.round(Math.random()*1E9)
        // console.log(file)
        cb(null, uniquiPrefix + '-' + file.originalname )
    }
})

const upload = multer({storage})    

module.exports = upload
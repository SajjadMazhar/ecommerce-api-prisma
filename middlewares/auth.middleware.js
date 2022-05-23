const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const authorization = req.headers.authorization
    const token = authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decoded)
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:decoded.id
            }
        })
        if(user.token !== token){
            return res.status(400).json({
                title:"error",
                msg:"unauthorized"
            })
        }
        req.id = decoded.id
        next()
    } catch (error) {
        res.status(500).json({
            title:"error",
            msg:"invalid token"
        })
    }
}
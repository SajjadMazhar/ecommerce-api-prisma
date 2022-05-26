
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

exports.isAdmin = async(req, res, next)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.id
            }
        })

        if(user.role !== 'ADMIN'){
            return res.status(401).json({
                status:"error",
                msg:"you don't have permission"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            status:"error",
            msg:"error while admin check:"+error.message
        })
    }
}

exports.isUser = async (req, res, next) =>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.id
            }
        })

        if(user.role === 'USER'){
            return next()
        }
        return res.status(401).json({
            status:"error",
            msg:"you don't have permission"
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            msg:"error while admin check:"+error.message
        })
    }
} 

exports.isSeller = async (req, res, next) =>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.id
            }
        })

        if(user.role === 'SELLER'){  
            return next()
        }
        res.status(401).json({
            status:"error",
            msg:"you don't have permission"
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            msg:"error while admin check:"+error.message
        })
    }
} 
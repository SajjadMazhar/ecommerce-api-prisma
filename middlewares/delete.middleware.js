const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

exports.userCheckForDeletion = async (req, res, next)=>{
    console.log(req.params.id)
    try {
        if(req.id == req.params.id){
            return next()
        }
        const primaryUser =  await prisma.user.findUnique({
            where:{
                id:req.id
            }
        })
        
        if(primaryUser.role === "ADMIN"){
            return next()
        }
        res.status(400).json({
            status:"error",
            msg:"you have no permission to do that"
        })

    } catch (error) {
        res.status(500).json({
            status:"error",
            msg:"error while delete check"
        })
    }
}
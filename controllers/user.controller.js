const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

exports.createUser = async(req, res) =>{
    const {products=[], name, email, password} = req.body
    try{
        const user = await prisma.user.create({
            data:{name, email, password, products},
        })
        res.status(201).json({status:"created", user})
    }catch(err){
        res.status(500).json({status:"internal server error", err:err.message})
    }
}

exports.getUsers = async(req, res)=>{
    try{
        const users = await prisma.user.findMany({
            include:{products:true}
        })
        res.json({status:"success", users})
    }catch(err){
        res.status(500).json({status:"internal server error", err:err.message})
    }
}
exports.getUserById = async(req, res)=>{
    const id = parseInt(req.params.id)
    try{
        const user = await prisma.user.findMany({
            where:{
                id
            },
            include:{
                products:true
            }
        })
        res.json({status:"success", user})
    }catch(err){
        res.status(500).json({status:"internal server error", err:err.message})
    }
}

exports.updateUser = async(req, res) => {
    const id = parseInt(req.params.id)
    try {
        const user = await prisma.user.update({
            where:{
                id
            },
            data:req.body
        })
        res.json({status:"updated", user})
    } catch (error) {
        res.status(500).json({status:"internal server error", err:err.message})
    }
}

exports.deleteUser = async(req, res)=>{
    const id = parseInt(req.params.id)
    try {
        const user = await prisma.user.delete({
            where:{
                id
            }
        })
        res.json({status:"deleted", user})
    } catch (error) {
        res.status(500).json({status:"internal server error", err:err.message})
    }
}

exports.buyProduct = async(req, res)=>{
    const id = parseInt(req.params.id)
    const userId = parseInt(req.body.userId)
    try {
        const user = await prisma.product.updateMany({
            where:{id},
            data:req.body
        })
        res.json({status:"created", user})
    } catch (error) {
        res.status(500).send({status:"internal server error", err:error.message})
    }
}
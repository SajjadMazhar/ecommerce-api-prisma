const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const md5 = require("md5")
const createUser = async(userDetails) =>{
    return await prisma.user.create({
        data:{
            ...userDetails,
            password:md5(userDetails.password)
        }
    })
}

module.exports = {
    createUser
}
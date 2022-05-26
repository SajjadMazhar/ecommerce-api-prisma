const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const otpGen = require("otp-generator")
const jwt = require("jsonwebtoken")
const {createUser} = require("../services/user.service")
const {sendOTP, mailOTP} = require("../services/otp.service")
const md5 = require("md5")

exports.signUp = async(req, res) =>{
    const {name, email, password, phoneNumber, role='USER'} = req.body;
    
    try {
        const otp = otpGen.generate(6, {upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false})
        const newUser = await createUser({name, email, password, phoneNumber,role,otp})
        mailOTP(otp, email)
        res.status(201).send({msg:"successfully signed up", data:{
            id:newUser.id,
            otp
        }})
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({msg:"something fialed"})
    }
}

exports.verifyUser = async(req, res)=>{
    const {id, otp} = req.body
    try {
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })

        if(user.otp !== otp){
            return res.status(400).json({err:"bad request", msg:"otp did not match"})
        }
        await prisma.user.update({
            where:{
                id
            },
            data:{
                verified:true
            }
        })
        res.json({title:"success", msg:"user verified successfully"})
    } catch (error) {
        res.status(500).json({
            title:"error",
            msg:`error while verifying user: ${error.message}`
        })       
    }
}

exports.signIn = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(400).json({
                title:"error",
                msg:"user not found"
            })
        }
        if(!user.verified){
            return res.status(400).json({
                title:"error",
                msg:"your account is not verified"
            })
        }
        if(!(user.password === md5(password))){
            return res.status(400).json({
                title:"error",
                msg:"invalid email or password"
            })
        }
        // creating token
        const token = jwt.sign({id:user.id}, process.env.SECRET_KEY, {
            expiresIn:"24h"
        })

        await prisma.user.update({
            where:{
                email
            },
            data:{
                token
            }
        })

        res.json({
            title:"login success",
            token
        })
    } catch (error) {
        res.status(500).json({
            title:"error",
            msg:`error while login: ${error.message}`
        })
    }
}

exports.deleteUser = async (req, res)=>{
    const {id} = req.params
    console.log(req.id, id)
    try {
        const user = await prisma.user.delete({
            where:{
                id:parseInt(id)
            }
        })
        res.status(200).json({
            status:"success",
            msg:"user deleted successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            status:"internal server error",
            msg:"error while deleting user:"+error.message
        })
    }   
}
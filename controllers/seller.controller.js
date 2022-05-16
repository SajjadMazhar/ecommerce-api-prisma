const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

exports.createSeller = async (req, res)=>{

    const {name, email, phone_number, categories = []} = req.body
    try{
      const seller = await prisma.seller.create({
        data:{
          name, email, phone_number, categories
        }
      })
      res.send({"status":"success"})
    }catch(err){
      res.send({err})
    }
}

exports.getSellers = async(req, res)=>{
  try{
    const sellers = await prisma.seller.findMany({include:{products:true}})
    res.send(sellers)
  }catch(err){
    res.send({err})
  }
}

exports.updateSeller = async (req, res)=>{
  const id = parseInt(req.params.id)
  try{
    const sellers = await prisma.seller.update({
      where:{
        id
      },
      data:req.body
    })
    res.send({status:"updated", sellers})
  }catch(err){
    res.status(500).send({status:"error"})
  }
}

exports.createSellers = async(req, res)=>{
  try {
    const sellers = await prisma.seller.createMany({
      data:req.body
    })
    res.status(201).json({status:"created", sellers})
  } catch (error) {
    
  }
}
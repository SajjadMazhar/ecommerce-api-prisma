const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

exports.createProduct = async(req, res)=>{
    
    const id = parseInt(req.params.id);
    const {
        name,
        description, 
        images=[], 
        price, 
        discounted_price,
        is_discounted,
        category,
        in_stock,
    } = req.body
    try{
        const product = await prisma.product.create({
            data:{
                name, description, images, price, discounted_price, is_discounted, category, in_stock, seller_id:id
            }
        })
    
        res.status(201).send({status:"created", data:product})
    }catch(err){
        res.status(500).send({status:"error"})
    }
    
}

exports.getProducts = async (req, res)=>{
    const id = req.params.id;
    try{
        const products = await prisma.product.findMany({
            where:{
                seller_id:parseInt(id)
            }
        })
        res.send({status:"success", data:products})
    }catch(err){
        res.status(500).send({status:"error"})
    }
}

exports.updateProduct = async(req, res)=>{
    const {seller_id, id} = req.params
    try{
        const product = await prisma.product.updateMany({
            where:{
                id:parseInt(id),
                seller_id:parseInt(seller_id)
            },
            data:req.body
        })
        res.send(product)
    }catch(err){
        res.send(err.message)
    }
}

exports.deleteProduct = async(req, res)=>{
    const {seller_id, id} = req.params
    try{
        const product = await prisma.product.deleteMany({
            where:{
                id:parseInt(id),
                seller_id:parseInt(seller_id)
            }
        })
        res.send(product)
    }catch(err){
        res.send(err.message)
    }
}
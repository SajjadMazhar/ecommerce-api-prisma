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

exports.createProducts = async(req, res)=>{
    try {
        const products = await prisma.product.createMany({
            data:req.body
        })
        res.status(201).json(products)
    } catch (error) {
        res.status(500).json({status:"internal server error", err:error.message})
    }
}

exports.getAllProducts = async(req, res)=>{
    const {
        limit=10, offset=0, sortBy='createdAt',
        sortOrder='asc'
    } = req.query
    try{
        const products = await prisma.product.findMany({
            take:limit,
            skip:offset,
            orderBy:{
                [sortBy]:sortOrder
            }
        })
        res.send({status:"success", data:products})
    }catch(err){
        res.status(500).send({status:err.message, msg:"error while getting products"})
    }
}

exports.getProducts = async (req, res)=>{
    const id = req.params.id;
    const {
        limit=10, offset=0, sortBy='createdAt',
        sortOrder='asc'
    } = req.query
    try{
        const products = await prisma.product.findMany({
            where:{
                seller_id:parseInt(id)
            },
            take:limit,
            skip:offset,
            orderBy:{
                [sortBy]:sortOrder
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
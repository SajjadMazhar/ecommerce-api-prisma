const { PrismaClient } = require('@prisma/client');
const logger = require('../logger/devLogger');
const prisma = new PrismaClient()
const client = require("../database/redis")
const host = 'http://localhost:3000'

exports.createProduct = async(req, res)=>{
    
    const id = parseInt(req.params.id);
    const {
        name,
        description,  
        price,
        discounted_price,
        is_discounted,
        category,
        in_stock,
    } = req.body
    if(!(name&&description&&price&&discounted_price&&is_discounted&&category&&in_stock)){
        console.log(req.body.category)
        return res.status(400).json({title:"failed", msg:"you left some empty fields"})
    }
    const imgFiles = req.files
    const images = imgFiles.map(file => {
        return `${host}/static//uploads/`+file.filename
    })
    try{
        // const product = await prisma.product.create({
        //     data:{
        //         name, description, images, price:parseInt(price), discounted_price:parseInt(discounted_price), is_discounted:Boolean(is_discounted), category, in_stock:Boolean(in_stock), seller_id:id
        //     }
        // })
        const product = await prisma.seller.update({
            where:{
                id:parseInt(id)
            },
            data:{
                products:{
                    create:[
                        {
                            name, description, images, price:parseInt(price), discounted_price:parseInt(discounted_price), is_discounted:Boolean(is_discounted), category, in_stock:Boolean(in_stock)
                        }
                    ]
                }
            }
        })
        res.status(201).send({status:"created", product})
    }catch(err){

        res.status(500).send({status:"error", msg:err.message})
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
    let products = await client.get("products")
    console.log(products)
    if(products){
        return res.send({status:"success", data:JSON.parse(products)})
    }
    const {
        limit=10, offset=0, sortBy='created_at',
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
        logger.info("fetched products")
        client.setEx("products", 20, JSON.stringify(products))
        res.send({status:"success", data:products})
    }catch(err){
        logger.error("error while getting all products")
        res.status(500).send({status:err.message, msg:"error while getting products"})
    }
}

exports.getProducts = async (req, res)=>{
    const id = req.params.id;
    const {
        limit=10, offset=0, sortBy='created_at',
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
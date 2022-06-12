const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const rzp = require("../services/razorpay.service")

const createOrder = async(req, res)=>{
    const {productIds, userId} = req.body

    const products = await prisma.product.findMany({
        where:{
            id:{
                in:productIds
            }
        }
    })
    const total = products.reduce((acc, curr)=>{
        if(curr.is_discounted) return acc +curr.discounted_price;
        return acc+curr.price
    },0)

    const order = await prisma.order.create({
        data:{
            productIds, userId, total
        }
    })

    //rzp order creation
    rzpOrder = await rzp.orders.create({
        amount:total, // money will be in paisa
        currency:"INR",
        receipt:order.id
    })
    const {id:rzpId, amount, receipt} = rzpOrder
    res.status(200).json({
        status:"success", rzpId, amount,receipt,
        msg:"Order successfully created"
    })
    
}

module.exports = {
    createOrder
}
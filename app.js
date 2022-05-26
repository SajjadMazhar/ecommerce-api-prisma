const express = require('express');
const morgan = require('morgan');
const authenticate = require("./middlewares/auth.middleware")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const {inputValidation} = require("./middlewares/validation.middleware")
const {userCheckForDeletion} = require("./middlewares/delete.middleware")
const { 
    createProduct,
    createProducts,
    getProducts, 
    updateProduct, 
    deleteProduct, 
    getAllProducts
} = require('./controllers/product.controller');
const {
    createSeller,
    createSellers,
    getSellers, 
    updateSeller 
} = require('./controllers/seller.controller')
const {
    signUp, 
    verifyUser,
    signIn,
    deleteUser
} = require('./controllers/user.controller')
require('dotenv').config();

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.get("/", (req, res)=>{
    res.send("running")
})

// Seller controller routes
app.post("/sellers", createSellers)
app.post("/seller", createSeller)
app.get("/seller", getSellers)
app.patch("/seller/:id", updateSeller)

// Product controller routes
app.get("/products", getAllProducts)
app.post("/seller/products", createProducts)
app.post("/seller/:id/product", createProduct)
app.get("/seller/:id/product", getProducts)
app.patch("/seller/:seller_id/product/:id", updateProduct)
app.delete("/seller/:seller_id/product/:id", deleteProduct)

// User controller routes
app.post("/auth/signup", inputValidation, signUp)
app.post("/auth/verify", verifyUser)
app.post("/auth/login", signIn)
app.delete("/auth/delete/:id", authenticate, userCheckForDeletion, deleteUser)

// protected routes
app.get("/protected", authenticate, async(req, res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.id
            }
        })
        res.json({
            title:"success",
            msg:`welcome ${user.name}, to protected route`
        })
    } catch (error) {
        
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

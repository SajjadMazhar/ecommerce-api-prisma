const express = require('express');
const morgan = require('morgan');
const authenticateUser = require("./middlewares/auth.middleware")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const {inputValidation} = require("./middlewares/validation.middleware")
const {isSeller} = require("./middlewares/user.middleware")
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
} = require('./controllers/user.controller');
const upload = require('./middlewares/multer.middleware');
require('dotenv').config();
const path = require("path")
const client = require("./database/redis")
const axios = require("axios")

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")())
app.use("/static", express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'));
app.set("view engine", "ejs")


// redis testing 
app.get("/todos", async(req, res)=>{
    const data = await client.get("todos")
    // data => null, id not set
    if(data){
        return res.send({
            title:"success",
            data:JSON.parse(data)
        })
    }
    const resp = await axios.get("https://jsonplaceholder.typicode.com/todos")
    // key,  expiration time(ttl) ,value
    client.setEx("todos", 10, JSON.stringify(resp.data));

    res.send(resp.data)

})

// Seller controller routes
app.post("/sellers", authenticateUser, isSeller, createSellers)
app.post("/seller", authenticateUser, isSeller, createSeller)
app.get("/seller", authenticateUser, getSellers)
app.patch("/seller/:id", authenticateUser, isSeller, updateSeller)

// Product controller routes
app.get("/products", getAllProducts)
app.post("/seller/products", createProducts)
app.post("/seller/:id/product", upload.array("images"), createProduct)
app.get("/seller/:id/product", getProducts)
app.patch("/seller/:seller_id/product/:id", updateProduct)
app.delete("/seller/:seller_id/product/:id", deleteProduct)
app.post("/upload", upload.single('image'), (req, res)=>{
    res.send("uploaded")
})
const {createOrder} = require("./controllers/order.controller");

// User controller routes
app.post("/auth/signup", inputValidation, signUp)
app.post("/auth/verify", verifyUser)
app.post("/auth/login", signIn)
app.delete("/auth/delete/:id", authenticateUser, userCheckForDeletion, deleteUser)

// order 
app.post("/order", createOrder)

// protected routes
app.get("/protected", authenticateUser, async(req, res)=>{
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

app.get("/up/:id", async(req, res)=>{
    try {
        const prod = await prisma.product.findUnique({
            where:{
                id:parseInt(req.params.id)
            }
        })
        res.render("index", {imgUrl:prod.images})
    } catch (error) {
        
    }

})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

const express = require('express');
const morgan = require('morgan');
const { 
    createProduct,
    createProducts,
    getProducts, 
    updateProduct, 
    deleteProduct 
} = require('./controllers/product.controller');
const {
    createSeller,
    // createSellers,
    getSellers, 
    updateSeller 
} = require('./controllers/seller.controller')
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    buyProduct
} = require("./controllers/user.controller")
require('dotenv').config();

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Seller controller routes
// app.post("/sellers", createSellers)
app.post("/seller", createSeller)
app.get("/seller", getSellers)
app.patch("/seller/:id", updateSeller)

// Product controller routes
app.post("/seller/products", createProducts)
app.post("/seller/:id/product", createProduct)
app.get("/seller/:id/product", getProducts)
app.patch("/seller/:seller_id/product/:id", updateProduct)
app.delete("/seller/:seller_id/product/:id", deleteProduct)
app.post("/user/:id/product", buyProduct)

// User controller routes
app.post("/user", createUser)
app.get("/user", getUsers)
app.get("/user/:id", getUserById)
app.patch("/user/:id", updateUser)
app.delete("/user/:id", deleteUser)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

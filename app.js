
const express = require('express');
const morgan = require('morgan');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('./controllers/product.controller');
const {createSeller, getSellers, updateSeller } = require('./controllers/seller.controller')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Seller controller routes
app.post("/seller", createSeller)
app.get("/seller", getSellers)
app.patch("/seller/:id", updateSeller)

// Product controller routes
app.post("/seller/:id/product", createProduct)
app.get("/seller/:id/product", getProducts)
app.patch("/seller/:seller_id/product/:id", updateProduct)
app.delete("/seller/:seller_id/product/:id", deleteProduct)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

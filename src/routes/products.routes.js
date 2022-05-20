'use strict'

const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();   
const productsController = require('../controllers/products.controller');

api.post('/newProduct', [mdAuth.ensureAuth], productsController.newProduct);
api.put('/update/:id', [mdAuth.ensureAuth], productsController.updateProduct);
api.delete('/delete/:id', [mdAuth.ensureAuth], productsController.delete);
api.get('/getProduct/:id', [mdAuth.ensureAuth], productsController.getProduct);
api.get('/getProducts', [mdAuth.ensureAuth], productsController.getProducts);
api.get('/getProductsByDes', [mdAuth.ensureAuth], productsController.getProductsByDes);
api.get('/getProductsByAsc', [mdAuth.ensureAuth], productsController.getProductsByAsc);
api.get('/getProductByName',[mdAuth.ensureAuth], productsController.productsByName);
api.get('/getProductByProvider',[mdAuth.ensureAuth], productsController.productsByProvider);

module.exports = api;
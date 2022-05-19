'use strict'

const Product = require('../models/products.model');
const {validateData, checkUpdateProduct, findProduct } = require('../utils/validate');

exports.newProduct = async(req,res)=>{
    try{
        const params = req.body;
        const data ={
            name: params.name,
            provider: params.provider,
        }
        const msg = validateData(data);
        if(!msg){
            const product = new Product(data);
            await product.save();
            return res.send({message: 'Product created successfully'});
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error saving product', err});
    }
}

exports.updateProduct = async(req,res)=>{
    try{
        const productId = req.params.id;
        const params = req.body;

        const checkProduct = await Product.findOne({_id: productId})
        if(!checkProduct){
            return res.status(400).send({message: 'Product cant be updated'})
        }else{
            const checkUpdate = await checkUpdateProduct(params);
            if(!checkUpdate){
                return res.status(400).send({message: 'Invalid params'})
            }else{
                const updateProduct = await Product.findOneAndUpdate({_id: productId}, params,{new:true}).lean();
                if (!updateProduct){
                    return res.send({message: 'Falided to update product'})
                }else{
                    return res.send({message: 'Product updated', updateProduct})
                }
            }
        }
    } catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error'})
    }
}

exports.delete = async (req,res)=>{
    try{
        const productId = req.params.id;
        const deleteProduct = await Product.findOneAndDelete({_id: productId}).lean();
        if(!deleteProduct){
            return res.status(400).send({message: 'Product not found'});
        }else{
            return res.send({message: 'Product deleted successfully', deleteProduct})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message:'Error deleting product', err})
    }
}

exports.getProduct = async(req,res)=>{
    try{
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId}).lean();
        if(!product){
            return res.status(400).send({message: 'Product not found'});
        }else{
            return res.send({message: 'Your product', product})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}
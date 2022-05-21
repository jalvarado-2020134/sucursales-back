'use strict'

const Product = require('../models/products.model');
const Company = require('../models/company.model');
const {validateData, checkProductsUpdate, findProduct, checkProduct, findProductOnCompany } = require('../utils/validate');
const res = require('express/lib/response');

exports.newProduct = async(req,res)=>{
    try{
        const company = await Company.findOne({_id: req.user.sub});
        const params = req.body;
        const data ={
            name: params.name,
            provider: params.provider,
            stock: params.stock
        }
        const msg = validateData(data);
        if(!msg){
            const product = new Product(data);
            await product.save();
            await company.products.push({product: product, stock: data.stock});
            await company.save();
            return res.send({message: 'Product created successfully'});
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error saving product'});
    }
}

exports.updateProduct = async(req,res)=>{
    try{
        const productId = req.params.id;
        const params = req.body;

        const company = await Company.findOne({_id: req.user.sub});
        const checkProduct = await Product.findOne({_id: productId})
        if(checkProduct){
            const checkUpdated = await checkProductsUpdate(params);
            if(checkUpdated){
                const checkProductCompany = await findProductOnCompany(company, checkProduct._id)
            if(checkProductCompany){
                const updateProduct = await Product.findOneAndUpdate({_id: productId}, params,{new:true});
                if(updateProduct){
                    return res.send({message: 'Product updated', updateProduct});
            } 
                }else{
                    return res.status(400).send({message: 'Could not update the product'})
                }
            }else{
                return res.status(400).send({message: 'This product not belong to this company'});
            }

        }else{
            return res.status(400).send({message: 'Product not found'});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting the product'});
    }     
}


exports.delete = async (req,res)=>{
    try{
        const productId = req.params.id;
        const company = await Company.findOne({_id: req.user.sub});
        const checkProduct = await Product.findOne({_id: productId});
        if(checkProduct){
            const checkProductCompany = await findProductOnCompany(company, checkProduct._id);
            if(checkProductCompany){
                const deleteProduct = await Product.findOneAndDelete({_id: productId});
                await company.products.pull(checkProductCompany);
                await company.save();
                return res.send({message: 'Product deleted successfully', deleteProduct});
            }else{
                return res.send({message: 'This product not belong to your company'});
            }
        }else{
            return res.send({message: 'Product not found'});
        }
        
        
    }catch(err){
        console.log(err);
        return res.status(500).send({message:'Error deleting product', err})
    }
}

exports.getProduct = async(req,res)=>{
    try{
        const productId = req.params.id;
        const company = await Company.findOne({_id: req.user.sub});
        const checkProduct = await Product.findOne({_id: productId});
        if(checkProduct){
            const checkCompanyProduct = await findProduct(company, checkProduct._id);
            if(checkCompanyProduct){
                return res.send({message: 'Your product', checkProduct});
            }else{
                return res.send({message: 'This product not belong to your company'});
            }
        }else{
            return res.status(400).send({message: 'Product not found'});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.getProducts = async(req,res)=>{
    try{
        const company = await Company.findOne({_id: req.user.sub}).populate('products.product');
        const products = company.products
        if(products){
            return res.send({message: 'Products found', products})
        }else{
            return res.send({message: 'Products not found'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting products'});
    }
} 

exports.getProductsByDes = async(req,res)=>{
    try{
        const company = await Company.findOne({_id: req.user.sub}).populate('products');
        const products = company.products.sort((a,b)=>{
            return b.stock - a.stock
        })
        if(products === null || products === undefined){
            return res.send({message: 'Products not found'})
        }else{
            return res.send({message:'Your products', products})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error'});
    }
}

exports.getProductsByAsc = async(req,res)=>{
    try{
        const company = await Company.findOne({_id: req.user.sub}).populate('products');
        const products = company.products.sort((a,b)=>{
            return a.stock - b.stock
        })
        if(products===null || products === undefined){
            return res.send({message:'Products not found'})
        }else{
            return res.send({message: 'Your products', products})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error'});
    }
} 

exports.productsByName = async(req,res)=>{
    try{
        const params = req.body;
        const data ={
            name: params.name
        };
        const msg = validateData(data);
        if(msg)return res.status(400).send(msg);
        const product = await Product.find({name:{$regex: params.name, $options: 'i'}})
            return res.send({product})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error', err})
    }
}

exports.productsByProvider = async(req,res)=>{
    try{
        const params = req.body;
        const data ={
            provider: params.provider
        };
        const msg = validateData(data);
        if(msg)return res.status(400).send(msg);
        const product = await Product.find({provider:{$regex: params.provider, $options: 'i'}})
            return res.send({product})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error', err})
    }
}
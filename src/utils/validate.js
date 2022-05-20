'use strict'

const Company = require('../models/company.model');
const Product = require('../models/products.model');
const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data) => {
    let keys = Object.keys(data),
        msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `El parámetro ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.findCompany = async (username) => {
    try {
        let exist = await Company.findOne({ username: username }).lean();
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
} 

exports.findProduct = async function(company, product){
    const products = company.products;
    let keys = Object.keys(products);

    for(let key of keys){
        if(products[key].product.toString() !== product.toString()){
            continue;
        }else{
            return products[key]._id;
        }
    }
    return undefined
}

exports.allDelete = async (products) => {
    try {
        for (let product of products) {
            let productId = product._id.toString()
            await Product.findOneAndDelete({ _id: productId })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (params) => {
    try {
        if (params.password || Object.entries(params).length === 0 || params.role || params.products) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdateProduct = async (params) => {
    try {
        if (params.password || Object.entries(params).length === 0 || params.role || params.products) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate_Admin = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.password) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkProduct = async (params) => {
    try {
        if (Object.entries(params).length === 0) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
} 

exports.findStock = async (branch, product) => {
    const branchProducts = branch.branchProducts;
    let keys = Object.keys(branchProducts);

    for (let key of keys) {
        if (branchProducts[key].product.toString() !== product.toString()) {
            continue;
        } else {
            return branchProducts[key].stock;
        }
    }
    return undefined
}

exports.findProduct = async (branch, product) => {
    const branchProducts = branch.branchProducts;
    let keys = Object.keys(branchProducts);

    for (let key of keys) {
        if (branchProducts[key].product.toString() !== product.toString()) {
            continue;
        } else {
            return branchProducts[key];
        }
    }
    return undefined
}

exports.findProductPlace = async (branch, product) => {
    const branchProducts = branch.branchProducts;
    let keys = Object.keys(branchProducts);

    for (let key of keys) {
        if (branchProducts[key].product.toString() !== product.toString()) {
            continue;
        } else {
            return key;
        }
    }
    return undefined
}


exports.findProductOnCompany = async (company, product) => {
    try {
        const products = company.products;

        let keys = Object.keys(products);

        for (let key of keys) {
            if (products[key].toString() !== product.toString()) {
                continue;
            } else {
                return products[key]._id;
            }
        }
        return undefined
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.findOfficeToProduct = async (branch, branchProductId) => {
    const branchProducts = branch.branchProducts;
    let keys = Object.keys(branchProducts);

    for (let key of keys) {
        if (branchProducts[key]._id.toString() !== branchProductId.toString()) {
            continue;
        } else {
            return branchProducts[key];
        }
    }
    return undefined
}
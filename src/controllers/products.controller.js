"use strict";

const Product = require("../models/products.model");
const Company = require("../models/company.model");
const Office = require("../models/office.model");
const {
  validateData,
  checkUpdateProduct,
  findProduct,
  checkProduct,
} = require("../utils/validate");
const res = require("express/lib/response");

exports.newProduct = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.user.sub });
    const params = req.body;
    const data = {
      name: params.name,
      provider: params.provider,
      stock: params.stock,
    };
    const msg = validateData(data);
    if (!msg) {
      const product = new Product(data);
      await product.save();
      await company.products.push({ product: product, stock: data.stock });
      await company.save();
      return res.send({ message: "Product created successfully" });
    } else {
      return res.status(400).send(msg);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error saving product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const params = req.body;

    const company = await Company.findOne({ _id: req.user.sub });
    const checkProduct = await Product.findOne({ _id: productId });
    if (checkProduct) {
      const checkProductCompany = await findProduct(company, checkProduct._id);
      if (checkProductCompany) {
        const updateProduct = await Product.findOneAndUpdate(
          { _id: productId },
          params,
          { new: true }
        );
        if (updateProduct) {
          return res.send({ message: "Product updated", updateProduct });
        } else {
          return res
            .status(400)
            .send({ message: "Could not update the product" });
        }
      } else {
        return res
          .status(400)
          .send({ message: "This product not belong to this company" });
      }
    } else {
      return res.status(400).send({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting the product" });
  }
};

exports.delete = async (req, res) => {
  try {
    const productId = req.params.id;
    const company = await Company.findOne({ _id: req.user.sub });
    const checkProduct = await Product.findOne({ _id: productId });
    if (checkProduct) {
      const checkProductCompany = await findProduct(company, checkProduct._id);
      if (checkProductCompany) {
        const deleteProduct = await Product.findOneAndDelete({
          _id: productId,
        });
        await company.products.pull(checkProductCompany);
        await company.save();
        return res.send({
          message: "Product deleted successfully",
          deleteProduct,
        });
      } else {
        return res.send({ message: "This product not belong to your company" });
      }
    } else {
      return res.send({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error deleting product", err });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const company = await Company.findOne({ _id: req.user.sub });
    const checkProduct = await Product.findOne({ _id: productId });
    if (checkProduct) {
      const checkCompanyProduct = await findProduct(company, checkProduct._id);
      if (checkCompanyProduct) {
        return res.send({ message: "Your product", checkProduct });
      } else {
        return res.send({ message: "This product not belong to your company" });
      }
    } else {
      return res.status(400).send({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.user.sub }).populate(
      "products.product"
    );
    const products = company.products;
    if (products) {
      return res.send({ message: "Products found", products });
    } else {
      return res.send({ message: "Products not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting products" });
  }
};

exports.sendProducts = async (req, res) => {
  try {
    const officeId = req.params.id;
    const params = req.body;
    var nameProduct = 0;
    var idproductfind = null;
    var stockO = 0;

    const office = await Office.findOne({ _id: officeId });

    if (office != null) {
      const product = await Product.findOne({
        name: params.name,
        company: params.company,
      }); 

      const productOffice = await Company.findOne({ _id: params.company }); 
      const productC = productOffice.products;

      const productO = office.Products;

      productC.forEach(function (productCompany) {
        if ((productCompany.product = product._id)) {
          nameProduct += productCompany.stock;
          return;
        }
      });

      /*if(productO != null){
        productO.forEach(function (productCompany) {
            
            stockO = productCompany.stock;
            idproductfind = productCompany.product;
            console.log(idproductfind); 
        });
      }*/

      //console.log(idproductfind);
      console.log(product._id)
      if (params.stock > nameProduct) {
       
        return res
          .status(400)
          .send({ message: "the stock is less than stock send" });
      }

    
      if (product._id != idproductfind ) {
     
        office.Products.push({ product: product._id, stock: params.stock });
        await office.save();
        return res.send({ message: "the database has been updated" });
      } else {
        const newStock = stockO + parseInt(params.stock);
        console.log(newStock);
           const result = await Office.findOneAndUpdate(
          { _id: officeId },
          {
            $set: {
                Products: {
                stock: newStock
            
            },
            },
          },
          { new: true }
        );
        return res.send({result  });
      }
    }
  } catch (err) {}
};

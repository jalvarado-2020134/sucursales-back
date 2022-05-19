'use strict'

const mongoose = require('mongoose');

const Office = mongoose.Schema({
    company:{type: mongoose.Schema.ObjectId, red: 'Company'},
    name: String,
    address: String,
    Products:[{
        product: {type: mongoose.Schema.ObjectId, ref:'Product'},
        stock: Number,
        sales: Number
    }]
});

module.exports = mongoose.model('addOffice', Office);
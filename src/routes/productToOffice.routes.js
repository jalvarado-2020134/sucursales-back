'use strict'

const productToOffice = require('../controllers/productToOffice.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');


module.exports = api;
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express(); 
const companyRoutes = require('../src/routes/company.routes');
const officeRoutes = require('../src/routes/office.routes');
const productsRoutes = require('../src/routes/products.routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/company', companyRoutes);
app.use('/office', officeRoutes);
app.use('/products', productsRoutes);

module.exports = app;
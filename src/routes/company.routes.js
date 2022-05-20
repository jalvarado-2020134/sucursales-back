'use strict'

const companyController = require('../controllers/company.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

api.post('/registerCompany_Admin', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.registerCompany_Admin);
api.put('/updateCompany_Admin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.updateCompany_Admin);
api.delete('/deleteCompany_Admin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.deleteCompany_Admin);
api.get('/getCompany/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], companyController.getCompany);
api.get('/getCompanies',[mdAuth.ensureAuth, mdAuth.isAdmin], companyController.getCompanies);
api.get('/myCompany', [mdAuth.ensureAuth], companyController.myCompany);


api.post('/register', companyController.register);
api.post('/login', companyController.login);

module.exports = api;

'use strict'

const express = require('express');
const req = require('express/lib/request');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const officeController = require('../controllers/office.controller');

api.post('/addOffice',[mdAuth.ensureAuth, mdAuth.isAdmin], officeController.addOffice);
api.get('/getOffice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], officeController.getOffice);
api.get('/getOffices', [mdAuth.ensureAuth, mdAuth.isAdmin], officeController.getOffices);
api.put('/update/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], officeController.updateOffice);
api.delete('/delete/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], officeController.delete);

module.exports = api;
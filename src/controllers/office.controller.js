'use strict'

const {validateData, Update, checkUpdate,} = require('../utils/validate');
const Office = require('../models/office.model');
const { param } = require('express/lib/request');

exports.addOffice = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            company: req.user.sub,
            name: params.name,
            address: params.address
        }

        const msg = validateData(data);
        if(!msg){
            const addOffice = new Office(data);
            await addOffice.save();
            return res.send({message: 'Office created successfully', Office});
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error saving office', err});
    }
}

exports.updateOffice = async (req, res)=>{ 
    try {
        const params = req.body; 
        const officeId = req.params.id;   
        const check = await checkUpdate(params); 

        if (check === false) {
            return res.status(400).send({message: 'Data not received'}); 
        } else {
            const updateOffice = await Office.findOneAndUpdate({_id: officeId}, params, {new: true}) 
            if (!updateOffice) {
                return res.send({message: 'Office not found'});
            } else {
                return res.send({message: 'Office update', updateOffice});
            }
        }
    } catch (error) {
        console.log(error); 
        return res.status(500).send({ message: 'Error updating office' });
    }
}  

exports.delete = async(req,res)=>{
    try{
        const officeId = req.params.id;
        const officeDelete = await Office.findOneAndDelete({_id: officeId});
        if(!officeDelete){
            return res.status(500).send({message:'Office not found'});
        }else{
            return res.send({message: 'Office deleted successfully', officeDelete});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting this office'});
    }
}

exports.getOffice = async(req,res)=>{
    try{
        const officeId = req.params.id;
        const office = await Office.findOne({_id: officeId});
        if(!office){
            return res.send({message: 'Office not found'});
        }else{
            return res.send({message: 'Office found', office});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting this office'});
    }
}

exports.getOffices = async(req,res)=>{
    try{
        const office = await Office.find();
        return res.send(office)
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting offices'});
    }
}
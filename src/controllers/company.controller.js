'use strict';

const { validateData, findCompany, checkPassword, encrypt, checkUpdate, checkUpdate_Admin } = require('../utils/validate');
const Company = require('../models/company.model');
const jwt = require('../services/jwt');

exports.registerCompany_Admin = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            typeOfCompany: params.typeOfCompany,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };

        const msg = validateData(data);
        if (!msg) {
            const checkCompany = await findCompany(data.username);
            if (!checkCompany) {
                if (params.role != 'ADMIN' && params.role != 'COMPANY') {
                    return res.send({ message: 'Invalid role' })
                } else {
                    data.password = await encrypt(params.password);
                    data.phone = params.phone;

                    let company = new Company(data);
                    await company.save();
                    return res.send({ message: 'Company saved successfully', company });
                }
            } else {
                return res.send({ message: 'Username already in use' });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error to register' });
    }
};

exports.updateCompany_Admin = async (req, res) => {
    try {
        const companyId = req.params.id;
        const params = req.body;

        const company = await Company.findOne({ _id: companyId })
        if (company) {
            const checkUpdate = await checkUpdate_Admin(params);
            if (checkUpdate === false) {
                return res.status(400).send({ message: 'invalid params' })
            } else {
                const checkRole = await Company.findOne({ _id: companyId })
                if (checkRole.role === 'ADMIN') {
                    return res.status(403).send({ message: 'You can´t update this company' });
                } else {
                    const checkCompany = await findCompany(params.username);
                    if (checkCompany && company.username != params.username) {
                        return res.send({ message: 'Username already in use' })
                    } else {
                        if (params.role != 'ADMIN' && params.role != 'COMPANY') {
                            return res.send({ message: 'Invalid role' })
                        } else {
                            const updateCompany = await Company.findOneAndUpdate({ _id: companyId }, params, { new: true }).lean();
                            if (!updateCompany) {
                                return res.send({ message: 'Error to update company' })
                            } else {
                                return res.send({ message: 'Company updated successfully', updateCompany })
                            }
                        }
                    }
                }
            }
        } else {
            return res.send({ message: 'This company does not exist' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error updating this company' });
    }
};

exports.deleteCompany_Admin = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findOne({ _id: companyId });
        if (!company) {
            return res.send({ message: 'Company not found' })
        } else {
            if (company.role === 'ADMIN') {
                return res.status(403).send({ message: 'You can´t delete this company' });
            } else {
                const deleteCompany = await Company.findOneAndDelete({ _id: companyId });
                if (!deleteCompany) {
                    return res.status(500).send({ message: 'Company not found' })
                } else {
                    return res.send({ message: 'Company deleted succesfully' })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error deleting this company' });
    }
};



exports.register = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            name: params.name,
            typeOfCompany: params.typeOfCompany,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'COMPANY'
        };
        let msg = validateData(data);

        if (!msg) {
            let checkCompany = await findCompany(data.username);
            if (!checkCompany) {
                data.password = await encrypt(params.password);
                data.phone = params.phone;

                let company = new Company(data);
                await company.save();
                return res.send({ message: 'Company registered successfully' });
            } else {
                return res.status(201).send({ message: 'Company already in use ' });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al registrarse' });
    }
};

exports.login = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password,
        };

        let msg = validateData(data);
        if (!msg) {
            let checkCompany = await findCompany(params.username);
            let checkPass = await checkPassword(params.password, checkCompany.password);
            delete checkCompany.password;

            if (checkCompany && checkPass) {
                const token = await jwt.createToken(checkCompany);
                return res.send({ message: '', token, checkUser: checkCompany });
            } else {
                return res.send({ message: 'El nombre de usuario y/o contraseña incorrectos' });
            }
        } else {
            return res.status(404).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al iniciar sesión' });
    }
};

exports.update = async (req, res) => {
    try {
        const companyId = req.user.sub;
        const params = req.body;

        const company = await Company.findOne({ _id: companyId })
        if (company) {
            const checkUpdated = await checkUpdate(params);
            if (checkUpdated === false) {
                return res.status(400).send({ message: 'Invalid params' })
            } else {
                const checkRole = await Company.findOne({ _id: companyId })
                if (checkRole.role === 'ADMIN') {
                    return res.status(403).send({ message: 'No puedes editar tu usuario si tienes el rol ADMIN' });
                } else {
                    const checkCompany = await findCompany(params.username);
                    if (checkCompany && company.username != params.username) {
                        return res.send({ message: 'Este nombre de usuario ya esta en uso' })
                    } else {
                        const updateCompany = await Company.findOneAndUpdate({ _id: companyId }, params, { new: true }).lean();
                        if (!updateCompany) {
                            return res.send({ message: 'No se ha podido actualizar la empresa' })
                        } else {
                            return res.send({ message: 'Empresa actualizada', updateCompany })
                        }
                    }
                }
            }
        } else {
            return res.send({ message: 'Esta empresa no existe' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la empresa' });
    }
};

exports.delete = async (req, res) => {
    try {
        const companyId = req.user.sub;

        const company = await Company.findOne({ _id: companyId }).populate('products')
        if (company.role === 'ADMIN') {
            return res.status(403).send({ message: 'No puede eliminar usuarios de rol ADMIN' });
        } else {
            await BranchOffice.deleteMany({ company: companyId })
            deleteProducts(company.products);
            const deleteCompany = await Company.findOneAndDelete({ _id: companyId });
            if (!deleteCompany) {
                return res.status(500).send({ message: 'Empresa no encontrada' })
            } else {
                return res.send({ message: 'Cuenta eliminada' })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando la empresa' });
    }
};


exports.getCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findOne({ _id: companyId });
        if (!company) {
            return res.send({ message: 'This company was not found ' })
        } else {
            return res.send(company);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting company' });
    }
};

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.send(companies)
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting companies' });
    }
};
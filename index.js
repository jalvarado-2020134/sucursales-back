'use strict'
const app = require('./configs/app');
const mongo = require('./configs/mongoConfig');
const port = 3200;

const { findCompany, encrypt } = require('./src/utils/validate');
const Company = require('./src/models/company.model');
mongo.init();
app.listen(port, async () => {
    console.log(`Server http running in port ${port}`)

    let data = {
        name: 'Walmart',
        username: 'SuperAdmin',
        email: 'walmart@gmail.com',
        password: await encrypt('123456'),
        role: 'ADMIN'
    };

    let checkCompany = await findCompany(data.username);
    if (!checkCompany) {
        let company = new Company(data);
        await company.save();
        console.log('ADMIN registered successfully')
    }
});
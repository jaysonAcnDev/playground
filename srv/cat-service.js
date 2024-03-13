const cds = require('@sap/cds')
const axios = require('axios')

module.exports = cds.service.impl((srv) => {
    srv.on('test', async (req) => {
        let my_array = ['1', '2']
        return 'Hello World';
    }),
    srv.on('addUser', 'post' , async (req) => {
        const { name, email, password } = req.data; // Extract data from request
    
        // Insert user data into MY_BOOKSHOP_USERS table
        await INSERT.into('MY_BOOKSHOP_USERS').columns('NAME', 'EMAIL', 'PASSWORD').values(name, email, password);
    
        return "User Successfully Added";
    }),
    srv.on('fetchUserData', async (req) => {
        // Retrieve user data from the database
        let query = SELECT.from('MY_BOOKSHOP_BOOKS');
        let result = await cds.run(query);
    
        // Return the fetched user data
        return result;
    }),
    srv.on('READ', 'userData', async (req) => {
        // Fetch user data from your database
        let query = SELECT.from('MY_BOOKSHOP_USERS').columns('NAME', 'EMAIL', 'PASSWORD');
        let result = await cds.run(query);
    
        // Return the fetched user data
        return result;
    })
})
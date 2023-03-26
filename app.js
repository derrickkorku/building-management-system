const express = require('express')
require('dotenv').config()
const usersRoute = require('./routes/users')
const buildingsRoute = require('./routes/buildings')
const path = require('path')

const app = express()

/**
 * Middlewares
 */
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


/**
 * Routes
 */
app.use('/users', usersRoute);
app.use('/buildings', buildingsRoute);


/**
 * Error Handler
 */
app.use((error, req, res, next) =>{
    if (error && error.message) {
        return res.send({success: false, message: error.message});
    }

    return res.send({success: false, message: "An unsupported error type occured"});
});


/**
 * 404 router handler
 */
app.use((req, res, next) => {
    return res.status(404).send({success: false, message: 'API NOT SUPPORTED'});
});

/**
 * Server listener
 */
app.listen(process.env.PORT, console.log('Server running on port 3000'))
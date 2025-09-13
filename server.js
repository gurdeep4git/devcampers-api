const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/error-handler");
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger-options');

// load route files
const bootcamps = require('./routes/bootcamps-route');
const courses = require('./routes/courses-router');

//load env variables
dotenv.config({path:'./config/config.env'})

// Connect Database
connectDB()

const app = express()

// Swagger docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//query parser
app.set('query parser', str => require('qs').parse(str));

// Body parser
app.use(express.json())

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)


//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})
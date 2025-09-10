const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/error-handler");

// load route files
const bootcamps = require('./routes/bootcamps-route');

//load env variables
dotenv.config({path:'./config/config.env'})

// Connect Database
connectDB()

const app = express()

//query parser
app.set('query parser', str => require('qs').parse(str));

// Body parser
app.use(express.json())

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)


//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})
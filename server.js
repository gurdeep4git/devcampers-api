const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/error-handler");
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger-options');
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/*
  ------  NOTE: These 2 packages are causing issues with apis being called ------
*/
//const xss = require('xss-clean');
//const mongoSanitize = require('express-mongo-sanitize');

// load route files
const bootcamps = require('./routes/bootcamps-route');
const courses = require('./routes/courses-route');
const auth = require('./routes/auth-route');
const users = require('./routes/users-route');
const reviews = require('./routes/reviews-route');

//load env variables
dotenv.config({path:'./config/config.env'})

// Connect Database
connectDB()

const app = express()

// Swagger docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Enable CORS
app.use(cors({
  origin: 'http://localhost:4200', // ✅ Allow your Angular dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Allow these methods
  credentials: false // Only if you're using cookies/auth headers
}));

// Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())

// Sanitize data
//app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
//app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
})
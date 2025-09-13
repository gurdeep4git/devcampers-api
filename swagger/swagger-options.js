const swaggerJsDoc = require('swagger-jsdoc');
const mongooseToSwagger = require('mongoose-to-swagger');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevCamper API',
      version: '1.0.0',
      description: 'API for managing bootcamps, courses'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ],
    components:{
        schemas: {
            Bootcamp: mongooseToSwagger(Bootcamp),
            Course:mongooseToSwagger(Course)
        }
    }
  },
  // Path to files with OpenAPI annotations
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
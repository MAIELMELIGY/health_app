const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare API Documentation',
      version: '1.0.0',
      description: 'API documentation for the healthcare application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Specify where to look for documentation comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

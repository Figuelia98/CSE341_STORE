const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'CSE341 API',
    description: 'STORE API project BYU IDAHO Software Development Student'
  },
  host: 'localhost:8080',
  schemes:['http','https']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];


swaggerAutogen(outputFile, routes, doc);
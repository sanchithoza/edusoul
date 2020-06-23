const fastify = require('fastify');
const serverless = require('serverless-http');
  const app = fastify();
//  console.log("function called");
  app.register(require('./routes/user'), { prefix: '/user' });

  app.get('/', (request, reply) => reply.send({ hello: 'everyone' }));
  
  // required as a module => executed on aws lambda
  module.exports.handler = serverless(app);

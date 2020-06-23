const _ = require('lodash');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const knex = require('../knex/knex');
const { hashPassword } = require('../tools/passwordHahing');
const { replace } = require('lodash');
module.exports = function (fastify, option, done) {
  //using stored procedure sp_signup_v4 ======================================
  fastify.post('/signup', async (req, reply) => {
    try {
      let password;
      hashPassword(req.body.pwd, function (result) {
        password = result;
        knex.raw(
          'Call sp_signup_v4(?,?,?,?,?,?,?)',
          [req.body.fname, req.body.surname, req.body.uname, password, req.body.phone, req.body.pkgid, Date.now()]
        ).then(function (result) {
          if (result) {
            return reply.send(result);
          }
        }, function (error) {
          return reply.send(error);
        });
      });
    } catch (error) {
      reply.send(error);
    }
  });
  //using stored procedure sp_loginprocess ======================================
  fastify.post('/login', async (req, reply) => {
    try {
      let password;
      hashPassword(req.body.pwd, function (result) {
        password = result;
        knex.raw(
          'Call sp_loginprocess(?,?)',
          [req.body.uname, password]
        ).then(function (result) {
          if (result) {
            return reply.send(result);
          }
          console.log("no result");
        });
      }, function (error) {
        return reply.send(error);
      });
    } catch (error) {
      reply.send("caught", error);
    }
  });
  fastify.post('/adddevice', async (req, reply) => {
    let data = req.body;
    try {
      let gcmtoken = "null";
      let deviceid = await knex('ap_deviceinfo').insert(data);
     //Part should be at login and device id must come with login attampt
      let token = await uuidv4();
      token = String(token).replace("-","");
      let result = await knex.raw('CALL sp_tokenregistration(?,?,?,?,?)',
        [data.user_id, token, gcmtoken, deviceid[0], Date.now()]);
        /*,
        function (result) {
          if (result) {
            console.log("2");
             reply.send(result);
          }
          console.log("3");
        }, function (error) {
          console.log("4");
           reply.send(error);
        });*/
        console.log("result");
        reply.send(result);
        
    } catch (error) {
      reply.send(error);
    }
  });
  done();
};
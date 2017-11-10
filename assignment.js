'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');

const {sendFCMmany, sendFCMone} = require('./tools/sendFCM');
const {sliceData} = require('./tools/splitData');
const students = require('./tools/students');

module.exports.sendNotification = (event, context, callback) => {

    var reqBody = JSON.parse(event.body);
    
        var catag = 'assignment';
    
        // For Class
        if(reqBody.class_id != "" && reqBody.subclass_id == ""){
            var type = 'class';
            sendStudent(reqBody,type,catag);
        }
    
        // For Section
        if(reqBody.class_id != "" && reqBody.subclass_id != ""){
            var type = 'section';
            sendStudent(reqBody,type,catag);
        }
    
        // // For Institute
        // if(reqBody.class_id == "" && reqBody.subclass_id == ""){
        //     var type = 'Institute';
        //     sendStudent(reqBody,type,catag);
        // }
    


  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Assignment Sent'
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

//-------------------------------------------- HELPER FUNCTIONS -------------------------------------------------

function sendStudent(body,type,catag) {
    
        students.getStudents(body,type,catag,(err,student) => {
            if(err){
                // res.status(400)
                // .send({
                //     code: err.code,
                //     sqlMessage: err.sqlMessage,
                //     sql: err.sql
                // });
            }
            else {
    
                var slicedFCM = sliceData(student,950);
    
                _.forEach(slicedFCM, function(value) {
                    sendFCMmany(value,body,catag);
                });
            }
        });
    }
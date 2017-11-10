'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');

const {sendFCMmany, sendFCMone} = require('./tools/sendFCM');
const {sliceData} = require('./tools/splitData');
const students = require('./tools/students');

module.exports.sendNotification = (event, context, callback) => {

    var reqBody = JSON.parse(event.body);
    
    var catag = "attendance";
    students.getStudentForAttendance(reqBody,catag);


  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Attendance Sent'
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

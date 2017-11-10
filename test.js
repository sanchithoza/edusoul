'use strict';

var FCM = require('fcm-push');

var serverKey = 'AAAAOfyNsfo:APA91bH6rvc91KMBwR2Tz5MW0mq54kXc60jZC_YXnkbApjtSkF5-Rm9wSLoQSuYp6xnogMd68hLcGpgye_DSWeaBQDhMTWtZT3XZ3Uyix_odFwDrbCy_8TQAuJyhBLV9aX5psGVR9HaZ';
var fcm = new FCM(serverKey);

module.exports.fcmtest = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'FCM Sent'
    }),
  };

  var message = {
    to: 'dznVb4L-lXQ:APA91bGDK1IeWBIGba8CjruxAxhjNc5xU2dBayCzKCT1obclVW_A1X4Oj9t7kN1Gz7cKi3CnGrByJF5tNQVqIHvC6iygTBg8VstjMRIpZ2znpQqtSvrT86ZAr4dvjAjVv8UIablJlsUa', // required fill with device token or topics
    //collapse_key: 'your_collapse_key',
    data: {
        type: 'announcement'
    },
    notification: {
        title: 'node api',
        body: 'Hello from node api2'
    }
  };

  fcm.send(message)
  .then(function(response){
      console.log("Successfully sent with response: ", response);
  })
  .catch(function(err){
      console.log("Something has gone wrong!");
      console.error(err);
  })

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

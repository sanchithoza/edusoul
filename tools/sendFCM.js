const FCM = require('fcm-push');
const {serverKey} = require('./../config/fcmConfig');
var fcm = new FCM(serverKey);

// Send notification to multiple device
exports.sendFCMmany = function (value,info,catag) {
    var message1 = {
        registration_ids: value, // For token array
        data: {
            type: catag,
            message: info
        }
    };

    fcm.send(message1)
    .then(function(response){
        //console.log("Successfully sent with response: ", response);
    })
    .catch(function(err){
        //console.log("Something has gone wrong!");
        //console.error(err);
    });
};

// Send notification to single device
exports.sendFCMone = function (value,info,catag) {
    var message1 = {
        to: value, // for single token
        data: {
            type: catag,
            message: info
        }
    };

    fcm.send(message1)
    .then(function(response){
        //console.log("Successfully sent with response: ", response);
    })
    .catch(function(err){
        //console.log("Something has gone wrong!");
        //console.error(err);
    });
};

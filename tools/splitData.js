const _ = require('lodash');

exports.sliceData = function (data,chunk) {
    var fcm_list = [];
    _.forEach(data, function(value, key) {
        if(value.gcm_token && value.gcm_token != 0){
            fcm_list.push(value.gcm_token);
        }
    });

    var slicedFCM = [];
    var i,j,temparray;
    for (i=0,j=fcm_list.length; i<j; i+=chunk) {
        temparray = fcm_list.slice(i,i+chunk);
        slicedFCM.push(temparray);
    }
    return slicedFCM;
};

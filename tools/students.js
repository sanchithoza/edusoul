const _ = require('lodash');

const {pool} = require('./../db/database-model');
const {sendFCMone} = require('./sendFCM');

module.exports.getStudents = function (body,type,catag, callback) {

    var qry = ``;

    // for institue
    if(type == 'Institute'){
        qry = `SELECT ap_usertoken.gcm_token AS gcm_token, map_student_institute.user_id AS student_id
                FROM map_student_institute
                LEFT JOIN ap_usertoken ON map_student_institute.user_id = ap_usertoken.user_id
                WHERE map_student_institute.institute_id = ${body.institute_id} AND map_student_institute.year_id = ${body.year_id} AND map_student_institute.is_dismissed = 0`;
    }
    // for section
    if(type == 'section'){
        qry = `SELECT ap_usertoken.gcm_token AS gcm_token, map_student_institute.user_id AS student_id
                FROM map_student_institute
                LEFT JOIN ap_usertoken ON map_student_institute.user_id = ap_usertoken.user_id
                WHERE map_student_institute.subclass_id = ${body.subclass_id} AND map_student_institute.institute_id = ${body.institute_id} AND map_student_institute.year_id = ${body.year_id} AND map_student_institute.is_dismissed = 0`;
    }
    // for class
    if(type == 'class'){
        qry = `SELECT ap_usertoken.gcm_token AS gcm_token, map_student_institute.user_id AS student_id
                FROM map_student_institute
                LEFT JOIN ap_usertoken ON map_student_institute.user_id = ap_usertoken.user_id
                LEFT JOIN mm_subclass ON map_student_institute.subclass_id = mm_subclass.subclass_id
                WHERE mm_subclass.class_id = ${body.class_id} AND map_student_institute.institute_id = ${body.institute_id} AND map_student_institute.year_id = ${body.year_id} AND map_student_institute.is_dismissed = 0`;
    }

    pool.getConnection().then(function(con) {
        // getting students
        con.query(qry)
        .then((result) => {
            var student = [];
            _.forEach(result, function(value, key) {
                student.push({"user_id": value.student_id, "gcm_token": value.gcm_token});
            });
            // returning student data to promise for getting parent data
            return student;
        })
        .then((student) => {
            _.forEach(student, function(value, key) {
                // getting parents for student
                con.query(`SELECT ap_usertoken.gcm_token AS gcm_token, map_parent_institute.user_id AS parent_id
                          FROM ap_usertoken
                          LEFT JOIN map_parent_institute ON map_parent_institute.user_id = ap_usertoken.user_id
                          WHERE map_parent_institute.student_id = ${value.user_id} AND map_parent_institute.is_dismissed = 0`)
                .then((result) => {
                    if(result.length > 0){
                        _.forEach(result, function(value, key) {
                            if(value.gcm_token && value.gcm_token != 0){
                                // sending notification to parent
                                sendFCMone(value.gcm_token,body,catag);
                            }
                        });
                    }
                })
                .catch((err) => {
                    callback(err);
                });
            });
            // return student gcm_token array for sending notification
            callback(undefined, student);
        })
        .catch((err) => {
            callback(err);
        });
    })
    .catch((err) => {
        callback(err);
    });
};

module.exports.getStudent = function (body,catag) {
    var qry = ``;
    qry = `SELECT gcm_token
            FROM ap_usertoken
            WHERE user_id = ${body.recieverid}`;

    pool.getConnection().then(function(con) {
        con.query(qry)
        .then((result) => {
            _.forEach(result, function(value, key) {
                // sending notificatin to receiver
                sendFCMone(value.gcm_token,body,catag);
            });
        })
        .catch((err) => {
            callback(err);
        });
    })
    .catch((err) => {
        callback(err);
    });
};

module.exports.getStudentForAttendance = function (body,catag) {
    var qry = ``;
    qry = `SELECT ap_usertoken.gcm_token AS gcm_token, map_student_institute.user_id AS student_id
            FROM map_student_institute
            LEFT JOIN ap_usertoken ON map_student_institute.user_id = ap_usertoken.user_id
            WHERE map_student_institute.subclass_id = ${body.subclass_id} AND map_student_institute.institute_id = ${body.institute_id} AND map_student_institute.year_id = ${body.year_id} AND map_student_institute.is_dismissed = 0`;

    pool.getConnection().then(function(con) {
        // getting student data
        con.query(qry)
        .then((result) => {
            _.forEach(result, function(value, key) {

                var student_id = value.student_id;
                var gcm_token = value.gcm_token;
                var qry1 = ``;
                qry1 = `SELECT status
                FROM im_attendance
                WHERE institute_id = ${body.institute_id} AND year_id = ${body.year_id} AND student_id = ${student_id} AND date = "${body.date}"`;
                // getting attendance status of student
                con.query(qry1)
                .then((result) => {
                    _.forEach(result, function(value, key) {
                        switch(value.status) {
                            case 1:
                                var status_code = 'Present';
                                break;
                            case 2:
                                var status_code = 'Absent';
                                break;
                            case 3:
                                var status_code = 'Holiday';
                                break;
                            case 4:
                                var status_code = 'Leave';
                                break;
                            default:
                                var status_code = 'Holiday';
                        }
                        var data1 = {
                            status_code,
                            student_id,
                            date: body.date,
                            subclass_id: body.subclass_id,
                            institute_id: body.institute_id,
                            status: value.status,
                        }
                        // sending notificatin to student
                        sendFCMone(gcm_token,data1,catag);
                        var qry2 = ``;
                        qry2 = `SELECT ap_usertoken.gcm_token AS gcm_token, map_parent_institute.user_id AS parent_id
                                  FROM ap_usertoken
                                  LEFT JOIN map_parent_institute ON map_parent_institute.user_id = ap_usertoken.user_id
                                  WHERE map_parent_institute.student_id = ${student_id} AND map_parent_institute.is_dismissed = 0`;
                        // getting parent data
                        con.query(qry2)
                        .then((result) => {
                            _.forEach(result, function(value, key) {
                                // sending notification to parent
                                sendFCMone(value.gcm_token,data1,catag);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            });
        })
        .catch((err) => {
            callback(err);
        });
    })
    .catch((err) => {
        callback(err);
    });
};

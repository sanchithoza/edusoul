var mysql = require('promise-mysql');

var pool = mysql.createPool({
  host     : 'db.edusoul.in',
  port     : '3306',
  user     : 'awsadmin',
  password : 'zresthine$#123',
  database: "edusoul"
});


module.exports = {pool};

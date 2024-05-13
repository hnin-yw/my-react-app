// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1', // Hostname or IP address
    port: '3306',        // MySQL port number
    user: 'root',
    password: 'r00t_user',
    database: 'dev001'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = connection;

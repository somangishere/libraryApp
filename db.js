const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library_db'
});

connection.connect((err) => {
    if (err) {
        console.log('error connecting to mysql: ', err);
        return;
    }
    console.log('connected to mysql');
});

module.exports = connection;
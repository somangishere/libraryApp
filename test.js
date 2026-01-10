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

connection.query('SELECT * FROM collections', (err, results) => {
    if (err) {
        console.log('query error', err);
        return;
    }
    console.log('data collections: ', results);
    return;
});

connection.query('SELECT * FROM loans', (err, results) => {
    if (err) {
        console.log('query error', err);
        return;
    }
    console.log('data loans: ', results);
    return;
});
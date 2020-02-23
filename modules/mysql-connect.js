const mysql = require('mysql2/promise');
const connect = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "node",
    password: process.env.dbpass,
    database: 'node',
    connectionLimit: 10,
    waitForConnections: true // 접속한계 넘어가면 기다렸다가 쓰게 함
});

module.exports = { connect };
// db.js
const mysql = require('mysql2/promise'); // Usamos la versión promise

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Contraseña vacía por defecto en XAMPP
  database: 'gravity',
  port: 3308,   // Puerto de MariaDB en XAMPP
  waitForConnections: true,
  connectionLimit: 10,
  authSwitchHandler: ({ pluginName }, cb) => {
    if (pluginName === 'mysql_native_password') {
      return cb(null, Buffer.from(''));
    }
    cb(new Error('Unsupported auth plugin'));
  }
});

module.exports = pool;
const mysql = require('mysql')
const config = require('../config/config')

const pool = mysql.createPool(config.mysql)

const query = (sql, val) => new Promise((resolve, reject) =>
  pool.getConnection((err, connection) => {
    if (err) { reject(err) } else {
      connection.query(sql, val, (err, fields) => {
        if (err) reject(err)
        else resolve(fields)
        connection.release()
      })
    }
  })
)

module.exports = query

const mysql = require('mysql')
const dbSecret = require('./mysql-secret')

let pool = null

if (!pool) {
  pool = mysql.createPool({
    ...dbSecret.bdcc
  })
}

module.exports = {
  pool
}
const mysql = require('../database/mysql.js')

module.exports = async (ctx, next) => {
  ctx.dbQuery = function(sql, values){
    return new Promise(( resolve, reject ) => {
      mysql.pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
    
            if ( err ) {
              reject( err )
            } else {
              resolve( rows )
            }
            // 结束会话
            connection.release()
          })
        }
      })
    })
  }
  
  try {
    await next()
  } finally {
    
  }
}
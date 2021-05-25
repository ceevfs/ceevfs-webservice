/**
 * @param name        管理员姓名
 * @param cardnum     管理员一卡通
 * @param permission  管理员权限
 * 
 */

exports.route = {
  async post({name,cardnum,permission}) {
    
    sql=`INSERT INTO ADMIN(UUID,NAME,CARDNUM,PERMISSION) VALUES(MD5(uuid()),'`+name+`','`+cardnum+`',`+permission+`)`

    let results = await this.dbQuery(sql).catch(err=>{
      console.log(err)
      throw "数据库错误"
    })
    
  }
}
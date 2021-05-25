//get query\schoolList {schoolName:'南大'}
exports.route = {
  async get({schoolName}) {

      sql=`SELECT schoolName,webUrl FROM allschool 
      WHERE schoolName like '%`+schoolName+`%'
      `

      let result=await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
      return result
    }
}
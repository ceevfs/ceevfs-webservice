//get query\majorSchool {schoolName:'南大'}
exports.route = {
  async get({majorName}) {

      sql=`SELECT schoolName,majorLevel FROM majorforschool
      WHERE majorName = '`+majorName+`'
      `

      let result=await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
      return result
    }
}
//get query\scoreList {year:2020,province:'北京',type:'不分文理'}
exports.route = {
  async get({year,province,type}) {

      sql=`SELECT score,peopleNum,sumPeopleNum FROM scorelist 
      WHERE year=`+year+` and province='`+province+`' and type='`+type+`'
      `

      let result=await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
      return result
    }
}
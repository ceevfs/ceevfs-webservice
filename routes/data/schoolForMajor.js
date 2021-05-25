const {all} = require('../../sdk/majorForSchool')
exports.route = {
  async post() {
    for(let i=0;i<all.length;i++)
    {

      sql=`INSERT INTO majorforschool(majorName,schoolName,majorLevel) VALUES(
      '计算机科学与技术',
      '`+all[i].学校名称+`','`+all[i].评估结果+`'
      )`

      await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
    }

    return 'OK'
  }
}

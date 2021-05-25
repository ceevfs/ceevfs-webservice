const {BeiJing2020} = require('../../sdk/Beijing2020.js')

exports.route = {
  async post() {
    
    for(let i=0;i<BeiJing2020.length;i++)
    {
      sql=`INSERT INTO scorelist(score,peopleNum,sumPeopleNum,type,year,province) VALUES(
      '`+BeiJing2020[i].score+`',`+BeiJing2020[i].peopleNum+`,
      `+BeiJing2020[i].sumPeopleNum+`,
      '不分文理',2020,'北京'      
      )`

      await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
    }

    return 'OK'
  }
}
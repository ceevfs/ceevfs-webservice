const {allSchool} = require('../../sdk/allSchool')

exports.route = {
  async post() {
    
    for(let i=0;i<allSchool.length;i++)
    {
      // serial: 序号
      // schoolName: 学校名称
      // province: 所在省份
      // location: 所在地区
      // city: 所在城市
      // is211: 是否211
      // is985: 是否985
      // InstitutionsHolding: 院校举办（公办/民办）
      // collegeType: 学校类别
      // schoolBelonging: 院校隶属
      // typeOfCampus: 办学类型
      // webUrl: 本科招生网网址
      let is985=false
      let is211=false
      if(allSchool[i].is985=='985'){
        is985=true
      }
      if(allSchool[i].is211=='211'){
        is211=true
      }
      sql=`INSERT INTO allschool(UID,serial,schoolName,province,location,city,is211,
        is985,InstitutionsHolding,collegeType,schoolBelonging,typeOfCampus) VALUES(
        MD5(uuid()),`+allSchool[i].serial+`,
      '`+allSchool[i].schoolName+`','`+allSchool[i].province+`',
      '`+allSchool[i].location+`','`+allSchool[i].city+`',
      `+is211+`,`+is985+`,
      '`+allSchool[i].InstitutionsHolding+`','`+allSchool[i].collegeType+`',
      '`+allSchool[i].schoolBelonging+`','`+allSchool[i].typeOfCampus+`'    
      )`
      
      await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
    }

    return 'OK'
  }
}
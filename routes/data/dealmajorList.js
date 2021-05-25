const {allMajor} = require('../../sdk/major')
exports.route = {
  async post() {
    for(let i=0;i<allMajor.length;i++)
    {

//{"序号":290,"门类":"工学","专业类":"材料类",
//"专业代码":"080401","专业名称":"材料科学与工程","学位授予门类":"工学",
//"修业年限":"四年","增设年份":""},

      sql=`INSERT INTO majorlist(UniCode,mainCategory,secondCategory,majorName,academicName,ageLimit,setYear) VALUES(
      '`+allMajor[i].专业代码+`','`+allMajor[i].门类+`',
      '`+allMajor[i].专业类+`','`+allMajor[i].专业名称+`',
      '`+allMajor[i].学位授予门类+`','`+allMajor[i].修业年限+`',
      '`+allMajor[i].增设年份+`'  
      )`

      await this.dbQuery(sql).catch(err=>{
        console.log(err)
        throw "数据库错误"
      })
    }

    return 'OK'
  }
}

exports.route = {
  async get() {
    
    let results

    sql=`SELECT * FROM datagrip.pet`

    results = await this.dbQuery(sql).catch(err=>{
      console.log(err)
      throw "数据库错误"
    })
    return { results }
  }
}
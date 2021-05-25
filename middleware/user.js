module.exports = async (ctx, next) => {
  ctx.getUserInfo = async (cardnum) => {
    let name, schoolnum
    if (cardnum.startsWith('21') || cardnum.startsWith('22') || cardnum.startsWith('23')) {
      // 本科生库
      const record = await ctx.db.execute(
        `SELECT XM, XJH FROM T_BZKS
        WHERE XH=:cardnum`, [cardnum]
      )
      if (record.rows.length > 0) {
        name = record.rows[0][0]
        schoolnum = record.rows[0][1]
      }
    }  else if (cardnum.startsWith('10')||cardnum.startsWith('22')||cardnum.startsWith('31')) {
      // 教职工库
      const record = await ctx.db.execute(
        `SELECT XM FROM T_JZG
        WHERE ZGH=:cardnum`, [cardnum]
      )
      if (record.rows.length > 0) {
        name = record.rows[0][0]
      }
    }
    return { name, schoolnum }
  }
  await next()
}
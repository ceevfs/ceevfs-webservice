// TODO：权限中间件
//还没开始设置
module.exports = async (ctx, next) => {
  /*
  ctx.permission = {
    isCommunityAdmin: async () => {
      const cardnum = ctx.user.cardnum
      let result = await ctx.db.execute(`
      SELECT * 
      FROM BBS_COMMUNITY_ADMIN
      WHERE CARDNUM =:cardnum
      `, { cardnum })
      return !!result.rows.length
    },
    isCommunityOperator: async () => {
      const cardnum = ctx.user.cardnum
      let result = await ctx.db.execute(`
      SELECT * 
      FROM BBS_COMMUNITY_OPERATOR
      WHERE CARDNUM =:cardnum
      `, { cardnum })
      return !!result.rows.length
    }
  }
  */
  await next()
}
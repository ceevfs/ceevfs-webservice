// const mongodb = require('../database/mongodb')
/**
  # 日志中间件

  代替 koa 的日志中间件，为了解析 return.js 中间件返回的 JSON 状态码，并且为了好看。
 */

// 修改为使用MongoDB数据库保存log
module.exports = async (ctx, next) => {
  let begin = moment()
  await next()
  // 此接口为验证是否可用的接口，不打印在log里
  if (ctx.path === '/access') {
    return
  }
  let end = moment()
  let duration = end - begin
  let time = end.format('H:mm:ss')


  // 考虑到某些情况（如重定向）时，返回中没有 JSON 格式的 body，只有 status
  let status = ctx.body && ctx.body.code || ctx.status

  // 可读性log，用于美观和增加可读性
  let logMsg = ctx.logMsg
  console.log(
    '  ' + time +
    ' | ' + (status < 400 ? chalkColored.green(status) : chalkColored.red(status)) +
    ' ' + ctx.method +
    ' ' + chalkColored.blue(ctx.path) +
    ' ' + duration + 'ms' +
    ' ' + chalkColored.green(ctx.request.ip) +
    (logMsg ? ' | ' + chalkColored.yellow(logMsg) : '')
  )

}

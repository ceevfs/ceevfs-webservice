const WebSocket = require('ws')

const port = 3333
const cardnum2ws = {}
const wsServer = new WebSocket.Server({ port })
console.log(`WebSocket服务启动, 端口为${port}`)

wsServer.on('connection', conn => {
  conn.on('message', message => {
    // 前端传hash之后的一卡通号
    conn.send('success')
    cardnum2ws[message] = conn
  })
})

module.exports = async (ctx, next) => {
  ctx.cardnum2ws = cardnum2ws
  await next()
}

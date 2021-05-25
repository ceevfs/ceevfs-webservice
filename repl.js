const vm = require('vm')
const qs = require('querystring')
const repl = require('repl')
const axios = require('axios')
const { config } = require('./app')
const prettyjson = require('prettyjson')
const crypto = require('crypto')

const hash = value => {
  return Buffer.from(crypto.createHash('sha256').update(value).digest()).toString('hex')
}


function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message)
  }
  return false
}

exports.start = () => {
  const testClient = axios.create({
    baseURL: `http://localhost:${config.port}/`,
    validateStatus: () => true
  })

  console.log('')
  console.log(`命令格式：${chalkColored.green('[get]/post/put/delete')} 路由 ${chalkColored.cyan('[参数1=值1...]')}`)
  console.log(`命令示例：${chalkColored.green('put')} api/card ${chalkColored.cyan('amount=0.2 password=123456')}`)
  console.log('')
  console.log('1. 需要传复杂参数直接用 js 格式书写即可，支持 JSON 兼容的任何类型：')
  console.log(`   ${chalkColored.green('put')} api/card ${chalkColored.cyan('{ amount: 0.2, password: 123456 }')}`)

  let replServer = repl.start({
    prompt: '\n> ',
    eval: (cmd, context, filename, callback) => {
      let parts = /^(?:(get|post|put|delete)\s+)?(\S+)(?:\s+([\s\S]+))?$/im.exec(cmd.trim())
      if (!parts) {
        return callback(null)
      }

      let [method, path, params] = parts.slice(1)

      let composedParams = {}
      if (params) {
        if (/^(\S+=\S+)(\s+(\S+=\S+))*$/m.test(params)) {
          params.split(/\s+/g).map(param => {
            let [key, value] = param.split('=')
            composedParams[key] = value
          })
      } else {
          try {
            composedParams = vm.runInThisContext('(' + params + ')')
          } catch (e) {
            if (isRecoverableError(e)) {
              return callback(new repl.Recoverable(e))
            } else {
              console.error(e.message)
              return callback(null)
            }
          }
        }
      }

      if (!method) {
        method = 'get'
      } else {
        method = method.toLowerCase()
      }

      if (Object.keys(composedParams).length && (method === 'get' || method === 'delete')) {
        path += '?' + qs.stringify(composedParams)
        composedParams = {}
      }

      testClient[method](path, composedParams).then(res => {
        console.log(res.data)
        if (/^\/?auth$/.test(path) && res.data.result) {
          if (method === 'post') {
            console.log(`\n登录成功了！`)
            testClient.defaults.headers = { token: res.data.result }
          } else if (method === 'delete') {
            console.log('\n退出登录了！')
            testClient.defaults.headers = {}
          }
        }
        console.log('\n' + prettyjson.render(res.data))
        callback(null)
      })
    }
  })

  replServer.on('exit', () => {
    console.log('退出服务器了！')
    process.exit()
  })

  require('./replHistory')(replServer, './.repl_history')
}

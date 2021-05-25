/**
  # 网络请求中间件

  允许模块代码直接进行网络请求。

  ## 暴露接口

  ctx.get         (string, object?) => Promise<AxiosResponse>
  ctx.post        (string, stringOrObject?, object?) => Promise<AxiosResponse>
  ctx.put         (string, stringOrObject?, object?) => Promise<AxiosResponse>
  ctx.delete      (string, object?) => Promise<AxiosResponse>
  ctx.cookieJar   tough.CookieJar

  例：
  - `let res = (await this.get/post/put/delete('http://google.com')).data`
 */
/* eslint no-empty:off */
const axios = require('axios')
const { config } = require('../app')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
const chardet = require('jschardet-eastasia')
//const SocksProxyAgent = require('socks-proxy-agent')
chardet.Constants.MINIMUM_THRESHOLD = 0

const iconv = require('iconv-lite')
const qs = require('querystring')


// const proxyOptions = 'socks5://118.126.82.142:8000'
// const httpsAgent = new SocksProxyAgent(proxyOptions, true)
// const httpAgent = new SocksProxyAgent(proxyOptions)
/**
  ## 安全性

  由于学校部分 HTTPS 的上游服务器可能存在证书问题，这里需要关闭 SSL 安全验证。
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = async (ctx, next) => {

  /**
  ## 饼干罐 🍪 Cookie Jar

  对于每一个 Context，将自动生成一个饼干罐 (Cookie Jar) 用于存储饼干 (Cookies)。
  在 auth 中间件中，若用户已登录，将向饼干罐中放入用户的初始饼干；以后的每次 axios 请求，会自动
  携带饼干罐进行，并保存请求得到的新饼干。(Trick or Treat!)
 */
  ctx.cookieJar = new tough.CookieJar()

  /**
  ## 实现

  支持 get/post/put/delete 四个方法
 */
  let _axios = axios.create({
    // 传入代理
    // httpsAgent:new SocksProxyAgent(proxyOptions, true),
    // httpAgent:new SocksProxyAgent(proxyOptions),

    // 使用当前会话的 CookieJar
    withCredentials: true,

    // 覆盖默认的状态码判断，防止在禁用重定向时误判 302 为错误返回
    validateStatus: s => s < 400,

    // 默认使用 URLEncoded 方式编码请求
    transformRequest(req) {
      if (typeof req === 'object') {
        return qs.stringify(req)
      }
      return req
    },

    // 自动检测返回内容编码
    responseType: 'arraybuffer',
    transformResponse(res) {
      let { encoding } = chardet.detect(res)
      if (encoding === 'windows-1250' || encoding === 'windows-1252') {
        // 验证码类型，不做处理
        return res
      } else { // 若 chardet 返回 null，表示不是一个已知编码的字符串，就当做二进制，不做处理
        try {
          res = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE').convert(res).toString()
          try { res = JSON.parse(res) } catch (e) { }
        } catch (e) {
          return res
        }
      }
      return res
    },

    ...config.axios
  })

  axiosCookieJarSupport(_axios)
  _axios.defaults.jar = ctx.cookieJar

  ;['get', 'post', 'put', 'delete'].forEach(k => {
    ctx[k] = async (...args) => {
      //if (true) {
      let transformRequest = (req) => {
        if (typeof req === 'object') {
          return qs.stringify(req)
        }
        return req
      }
      let transformResponse = (res) => {
        let { encoding } = chardet.detect(res)
        if (encoding === 'windows-1250' || encoding === 'windows-1252') {
          // 验证码类型，不做处理
          return res
        } else { // 若 chardet 返回 null，表示不是一个已知编码的字符串，就当做二进制，不做处理
          try {
            res = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE').convert(res).toString()
            try { res = JSON.parse(res) } catch (e) { }
          } catch (e) {
            return res
          }
        }
        return res
      }
      try {
        return await ctx.spiderServer.request(ctx, k, args, config.axios, transformRequest, transformResponse)
      } catch (e) {
        return await _axios[k](...args)
      }
    }
  })

  await next()
}

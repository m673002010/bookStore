const userService = require('../service/userService')
const jwt = require('jsonwebtoken')

async function login (ctx, next) {
    const { code, appId, appSecret, grant_type, rawData  } = ctx.request.body

    // 请求微信接口
    let res = await ctx.rq.get({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        params: {
            js_code: code,
            appid: appId,
            secret: appSecret,
            grant_type
        }
    }).catch(err => console.log('err:', err.message))

    // 成功获取openid和session_key
    if (res && res.openid && res.session_key) {
        const { openid, session_key } = res
        
        // 添加用户信息到数据库
        const userInfo = JSON.parse(rawData)
        Object.assign(userInfo, { openid, session_key })
        const addRes = await userService.addUser(userInfo)

        if (addRes) { 
            // 签发 token，1天有效期
            const userInfo = { openid, session_key }
            const token = jwt.sign(userInfo, config.privateKey, { expiresIn: '1d' })
            
            ctx.body = {
                code: 0,
                message: '登录成功',
                data: {
                    token
                }
            }

            return
        }
    }

    ctx.body = {
        code: -1,
        message: '登录失败'
    }
}

module.exports = {
    login
}

const jwt = require('jsonwebtoken')

async function checkLogin(ctx, next) {
    try {
        const token = ctx.get('Authorization') // 获取请求 Header 中 Authorization 值
        if (['/pay/pay', '/user/collectBook'].includes(ctx.path)) {
            if (!token) {
                ctx.body = { code: -1, message: '未登陆' }
                return
            } 
        }

        if (token) {
            userInfo = jwt.verify(token, config.privateKey) // 验证 token
            if (userInfo) ctx.userInfo = userInfo
        }
        
        await next()
    } catch (err) {
        console.log('checkLogin异常:', err)
        ctx.body = { code: -1, message: 'checkLogin异常' }
    }
}

module.exports = {
    checkLogin
}

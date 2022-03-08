const userService = require('../service/userService')

async function collectBook (ctx, next) {
    const { bookInfo, isCollected } = ctx.request.body
    const openid = ctx.userInfo.openid

    await userService.collectBook({ openid, bookInfo, isCollected })

    ctx.body = {
        code: 0,
        message: '收藏成功'
    }
}

module.exports = {
    collectBook
}

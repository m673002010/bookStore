const userService = require('../service/userService')

async function collectBook (ctx, next) {
    const { bookInfo, isCollected } = ctx.request.body
    const openid = ctx.userInfo.openid

    const res = await userService.collectBook({ openid, bookInfo, isCollected })

    if (res) {
        ctx.body = {
            code: 0,
            message: '收藏成功'
        }
    } else {
        ctx.body = {
            code: -1,
            message: '收藏失败'
        }
    } 
}

async function collectedBooks (ctx, next) {
    const openid = ctx.userInfo.openid

    console.log(openid)

    const data = await userService.collectedBooks({ openid })

    ctx.body = {
        code: 0,
        message: '图书信息查询成功',
        data
    }
}

async function cancelCollected (ctx, next) {
    const openid = ctx.userInfo.openid
    const { bookId } = ctx.request.query

    const res = await userService.cancelCollected({ openid, bookId })

    if (res) {
        ctx.body = {
            code: 0,
            message: '取消收藏成功'
        }
    } else {
        ctx.body = {
            code: -1,
            message: '取消收藏失败'
        }
    }
}

module.exports = {
    collectBook,
    collectedBooks,
    cancelCollected
}

const cateService = require('../service/cateService')
const bookService = require('../service/bookService')

async function cateList (ctx, next) {
    const data = await cateService.cateList(ctx, next)

    return ctx.body = {
        code: 0,
        message: '成功',
        data
    }
}

module.exports = {
    cateList
}

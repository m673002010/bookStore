const bookService = require('../service/bookService')
const cheerio = require('cheerio')
const fs = require('fs')

async function search (ctx, next) {
    const { keyword, cateId } = ctx.request.query

    const { bookList, total } = await bookService.bookList(ctx, next)

    ctx.body = {
        code: 0,
        message: '搜索图书列表成功',
        data: {
            bookList, 
            total
        }
    }
}

module.exports = {
    search
}

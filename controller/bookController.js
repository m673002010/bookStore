const bookService = require('../service/bookService')

async function bookList (ctx, next) {
    const res = await bookService.bookList(ctx.request.query)

    ctx.body = {
        code: 0,
        message: '获取图书列表成功',
        data: res
    }
}

async function bookDetail (ctx, next) {
    const { bookId } = ctx.request.query
    const { openid } = ctx.userInfo ? ctx.userInfo : {}

    if (!bookId) {
        return ctx.body = { code: -1, message: '缺少必要参数' }
    }

    const data = await bookService.bookDetail({ bookId, openid })

    ctx.body = {
        code: 0,
        message: '获取图书详情成功',
        data
    }
}

async function addBook (ctx, next) {
    const param = ctx.request.body

    if (!param.isbn || !param.name || !param.author) {
        return ctx.body = { code: -1, message: '缺少必要参数' }
    }

    return ctx.body = await bookService.addBook(param)
}

async function swiperList (ctx, next) {
    return ctx.body = {
        code: 0,
        message: '获取导航列表成功',
        data: [
            '虽然辛苦，我还是会选择那种滚烫的人生。——北野武',
            '在世间，本就是各人下雪，各人有各人的隐晦和皎洁。——今山事',
            '我想和你互相浪费，一起虚度短的沉默，长的无意义，一起消磨精致而苍老的宇宙。——李元胜',
            '你瞧这些白云聚了又散，散了又聚，人生离合，亦复如斯。——金庸',
            '月光下，你带着笑地向我步来，月色与雪色之间，你是第三种绝色。——余光中'
        ]
    } 
}

module.exports = {
    bookList,
    bookDetail,
    addBook,
    swiperList
}

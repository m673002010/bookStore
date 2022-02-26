const bookService = require('../service/bookService')
const lodash = require('lodash')

async function search (ctx, next) {
    const { keyword } = ctx.request.query

    // 请求豆瓣的搜索接口
    const res = await ctx.rq.get({
        url: 'https://book.douban.com/j/subject_suggest',
        params: {
            q: keyword
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
        }
    }).catch(err => console.log('err message:', err.message))

    let data = res.map(item => {
        // 搜寻作者会返回作者信息和书本信息，type为b的是书本条目
        if (item.type === 'b') {
            return {
                bookId: item.id,
                name: item.title,
                author: item.author_name,
                imageSrc: item.pic,
                publishDate: item.year
            }
        }
    })
    data = lodash.compact(data)

    ctx.body = {
        code: 0,
        message: '搜索图书列表成功',
        data: {
            bookList: data,
            total: data.length
        }
    }
}


module.exports = {
    search
}

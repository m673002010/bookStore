const cheerio = require('cheerio')

async function getBookInfoById(ctx, next) {
    try {
        const { bookId } = ctx.request.query

        // 豆瓣的图书详情
        const res = await ctx.rq.get({
            url: 'https://book.douban.com/subject/' + bookId,
            params: {},
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
            }
        }).catch(err => console.log('err message:', err.message))

        const $ = cheerio.load(res)

        const bookInfo = { bookId }

        // 从meta提取图书信息
        bookInfo.name = $('meta[property="og:title"]').attr('content')
        bookInfo.url = $('meta[property="og:url"]').attr('content')
        bookInfo.imageSrc = $('meta[property="og:image"]').attr('content')
        bookInfo.isbn = $('meta[property="book:isbn"]').attr('content')
        bookInfo.author = $('meta[property="book:author"]').attr('content')
        
        // 出版社和出版时间
        const keywords = $('meta[name="keywords"]').attr('content')
        bookInfo.publisher = keywords.split(',')[2]
        bookInfo.publishDate = keywords.split(',')[3]

        // 正则提取定价和页数
        const info = $('#info').html()
        const price = info.match(/定价:<\/span>(.*?)[元]{0,1}<br>/)
        const pageTotal = info.match(/页数:<\/span>(.*?)<br>/)

        bookInfo.price = price ? (+price[1]).toFixed(2) : 0
        bookInfo.pageTotal = pageTotal ? +pageTotal[1] : 0

        // 图书简介
        const intro = $('.intro', '.hidden').html() || $('.intro').html()
        bookInfo.introduction = intro

        return bookInfo
    } catch (e) {
        console.log('getBookInfoById异常', e.message)
        return null
    }
}

module.exports = {
    getBookInfoById
}

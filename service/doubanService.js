const cheerio = require('cheerio')
const rq = require('../lib/req')

async function getBookInfoById(bookId) {
    try {
        // 豆瓣的图书详情
        const res = await rq.get({
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

async function getBookListByCate({ cateName, start }) {
    try {
        // 豆瓣的图书详情
        const res = await rq.get({
            url: encodeURI('https://book.douban.com/tag/' + cateName), // 路径出现中文，encode
            params: {
                start
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
            }
        }).catch(err => console.log('err message:', err.message))

        const $ = cheerio.load(res)

        const bookList = []
        $('.subject-item').each((i, elem) => {
            const book = {}

            // 图片
            book.imageSrc = $('img', elem).attr('src')

            // id、名字、链接
            const info = $('.info', elem)
            book.name = $('a', info).attr('title')
            book.url = $('a', info).attr('href')
            book.id = +(book.url.match(/subject\/(\d+)/)[1] || '')

            // 出版信息
            book.pub = $('.pub', elem).text()
            book.author = book.pub.split('/')[0].replace(/[^\u4e00-\u9fa5a-zA-Z0-9\[\]]/g, "")
            book.publishDate = book.pub.match(/([0-9-]+)/) && book.pub.match(/([0-9-]+)/)[0]

            bookList.push(book)
        })

        return bookList
    } catch (e) {
        console.log('getBookListByCate异常', e.message)
        return null
    }
}

module.exports = {
    getBookInfoById,
    getBookListByCate
}

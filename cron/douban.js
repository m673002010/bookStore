const puppeteer = require('puppeteer')
const bookCollection = require('../db/book')
let browser = null

// 延时函数
const delay = function (delayTime) {
  return new Promise(resolve => setTimeout(resolve, delayTime))
}

//booksExpress()

async function booksExpress() {
  try {
    console.log('======booksExpress=====', new Date())

    if (!browser) browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    // 访问豆瓣主页，获取新书榜单
    const HomePage = await browser.newPage()
    await HomePage.goto('https://book.douban.com/')
    const infoArr = await HomePage.$$('.books-express .info')

    // 存放url的集合、存放图书信息的数组
    const set = new Set() 
    const data = []

    // 图书详情页面
    const detailPage = await browser.newPage()

    for (const info of infoArr) {
      const book = {}
      const url = await info.$eval('a[href]', v => v.href) || ''

      // 轮播榜单有重复
      if (set.has(url)) continue
      set.add(url)
      book.url = url
      book.publishDate = (await info.$eval('.more-meta .year', v => v.innerText) || '').replace(/[^0-9-]/gi, "")
      book.publisher = (await info.$eval('.more-meta .publisher', v => v.innerText) || '').replace(/[^\u4e00-\u9fa5]/gi, "")

      // 根据图书详情页meta补充其他信息
      await detailPage.goto(url)
      book.name = await detailPage.$eval("head meta[property='og:title']", elem => elem.content)
      book.imageSrc = await detailPage.$eval("head meta[property='og:image']", elem => elem.content)
      book.author = await detailPage.$eval("head meta[property='book:author']", elem => elem.content)
      book.isbn = await detailPage.$eval("head meta[property='book:isbn']", elem => elem.content)

      // 从url提取图书的豆瓣id
      book.bookId = +(book.url.match(/subject\/(\d+)/)[1] || '')

      // 获取目录，保留中文英文数字
      const catalogue = await detailPage.$eval(`#dir_${book.bookId}_full`, elem => elem.innerText).catch(err => err ? '' : '')
      book.catalogue = catalogue.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\r\t\n]/gi, "")
      book.catalogue = catalogue

      // 获取内容简介
      let intro = await detailPage.$eval('.related_info .all .intro', elem => elem.innerText).catch(err => err ? '' : '')
      intro = intro ? intro : await detailPage.$eval('.related_info .intro', elem => elem.innerText).catch(err => err ? '' : '')
      book.introduction = intro.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\r\t\n]/gi, "")
      book.introduction = intro

      console.log('==================')
      console.log(book)
      data.push(book)

      // 避免访问频率过高，隔3秒
      await delay(5000)
    }
    
    await bookCollection.insertMany(data)
  } catch (err) {
    console.log('booksExpress err:', err)
  } finally {
    await browser.close()
  }
}

module.exports = {
  booksExpress
}

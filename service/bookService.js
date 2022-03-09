const bookCollection = require('../db/book')
const userBookCollection = require('../db/userBook')
const doubanService = require('./doubanService')

async function addBook(param) {
  try {
    const res = await bookCollection.insertOne(param)

    if (res) return { code: 0, message: '添加图书成功' }
  } catch (e) {
      console.log('addBook异常', e.message)
      return { code: 0, message: '添加图书失败' }
  }
}

async function bookList(param) {
  try {
    const { cateName = '', pageNum = 1, pageSize = 20 } = param
    // const bookList = await bookCollection.find().limit(+pageSize).skip(+pageSize * (+pageNum - 1)).toArray()
    // const total = await bookCollection.count()

    const start = +pageSize * (+pageNum - 1)
    const bookList = await doubanService.getBookListByCate({ cateName, start })

    return { bookList, total: 1000 }
  } catch (e) {
      console.log('bookList异常', e.message)
      return { bookList: [], total: 0 }
  }
}

async function bookDetail(param) {
  try {
    const { bookId, openid } = param

    const data = {}

    // 查询图图书
    data.bookInfo = await bookCollection.findOne({ bookId: +bookId })

    // 是否已收藏图书
    if (data.bookInfo && openid) {
      const res = await userBookCollection.findOne({ openid, bookId: +bookId })
      if (res) data.isCollected = res.isCollected
    }

    // 数据库如果没有对应的数据，则请求豆瓣获取
    if (!data.bookInfo) {
      data.bookInfo = await doubanService.getBookInfoById(bookId)
    }

    return data
  } catch (e) {
      console.log('bookDetail异常', e.message)
      return {}
  }
}

module.exports = {
  addBook,
  bookList,
  bookDetail
}

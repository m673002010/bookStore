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

async function bookList(ctx, next) {
  try {
    const { keyword = '', cateId = 0, pageNum = 1, pageSize = 10 } = ctx.request.query
    const bookList = await bookCollection.find().limit(+pageSize).skip(+pageSize * (+pageNum - 1)).toArray()
    const total = await bookCollection.count()

    return { bookList, total }
  } catch (e) {
      console.log('bookList异常', e.message)
      return { code: 0, message: '获取图书列表失败' }
  }
}

async function bookDetail(ctx, next) {
  try {
    const { bookId } = ctx.request.query

    const data = {}

    // 查询图图书
    data.bookInfo = await bookCollection.findOne({ bookId: +bookId })

    // 是否已收藏图书
    if (data.bookInfo) {
      const userInfo = ctx.userInfo
      const res = await userBookCollection.findOne({ openId: userInfo.openId, bookId: +bookId })
      if (res) data.isCollected = res.isCollected
    }

    // 数据库如果没有对应的数据，则请求豆瓣获取
    if (!data.bookInfo) {
      data.bookInfo = await doubanService.getBookInfoById(ctx, next)
    }

    return data
  } catch (e) {
      console.log('bookDetail异常', e.message)
      return { code: 0, message: '获取图书详情失败' }
  }
}

module.exports = {
  addBook,
  bookList,
  bookDetail
}

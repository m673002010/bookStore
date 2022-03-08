const userCollection = require('../db/user')
const bookCollection = require('../db/book')
const userBookCollection = require('../db/userBook')

async function addUser(userInfo) {
  try {
    const findRes = await userCollection.findOne({ openid: userInfo.openid })

    if (findRes) return true

    const insertRes = await userCollection.insertOne(userInfo)

    if (insertRes) return true
  } catch (e) {
      console.log('添加用户异常', e.message)
      return false
  }
}

async function collectBook (param) {
  try {
    const bookInfo = param.bookInfo
    bookInfo.bookId = +bookInfo.bookId
    delete bookInfo._id

    // 用户收藏的书籍，在书籍表新增
    await bookCollection.updateOne(
      {
        bookId: bookInfo.bookId,
        isbn: bookInfo.isbn,
      },
      {
        $set: bookInfo
      },
      {
        upsert: true
      }
    )

    console.log(param.isCollected)
    // 关联用户和书籍
    const res = await userBookCollection.updateOne(
      {
        bookId: bookInfo.bookId,
        isbn: bookInfo.isbn,
        openid: param.openid,
      }, 
      {
        $set: { isCollected: param.isCollected } 
      },
      {
        upsert: true
      }
    )

    console.log('======res======', res)
    return true
  } catch (e) {
      console.log('收藏/取消收藏图书异常', e.message)
      return false
  }
}

module.exports = {
  addUser,
  collectBook
}

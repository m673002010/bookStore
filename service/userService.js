const userCollection = require('../db/user')

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

module.exports = {
  addUser
}


const cateCollection = require('../db/category')

async function cateList() {
  try {
    const cateList = await cateCollection.find().toArray()

    return toTree(cateList)
  } catch (e) {
      console.log('cateList异常', e.message)
      return { code: 0, message: '获取分类列表失败' }
  }
}

function toTree(data) {
  const result = []
  if(!Array.isArray(data) || data.length === 0) {
      return result
  }

  const map = {}
  data.forEach(item => {
      map[item.cateId] = item
  })

  data.forEach(item => {
      const parent = map[item.pid]
      if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(item)
      } else {
          result.push(item)
      }
  })

  return result
}

module.exports = {
  cateList
}


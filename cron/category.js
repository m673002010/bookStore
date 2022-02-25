const cheerio = require('cheerio')
const rq = require('../lib/req')
const cateCollection = require('../db/category')

async function fetchCategory () {
  try {
    console.log('fetch:', new Date())

    // 请求豆瓣标签页
    const res = await rq.get({
      url: 'https://book.douban.com/tag/',
      params: {},
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
      }
    }).catch(err => console.log('err message:', err.message))

    const $ = cheerio.load(res)

    // 获取标签
    const category = {}
    $('.tag-title-wrapper').each((i, elem) => {
      const obj = {}

      // 1级标签字符串，提取汉字
      const parentStr = ($(elem).text() || '').replace(/[^\u4e00-\u9fa5]/gi, "")
      obj[parentStr] = []

      // 兄弟节点
      const nextElem = $(elem).next()

      // 2级标签字符串
      $('a', nextElem).each((j, elem_2) => {
        const childStr = $(elem_2).text() || ''
        obj[parentStr].push(childStr)
      })

      Object.assign(category, obj)
    })

    // 将分类标签存入redis
    await redisClient.set('category', JSON.stringify(category || []))

  } catch (err) {
    console.log('err message:', err)
  }
}

async function updateCategory () {
  try {
    console.log('update:', new Date())

    // 获取分类标签
    let category = await redisClient.get('category')
    if (!category) return
    category = JSON.parse(category)

    // 先删除旧集合
    await cateCollection.drop()
    
    // 插入标签
    let cateId = 0
    const cateLv1 = Object.keys(category)
    for (let i = 0; i < cateLv1.length; i++) {
      // 插入1级
      cateId++
      await cateCollection.insertOne({ cateId, name: cateLv1[i] })

      // 记录父id
      const pid = cateId

      // 插入2级
      const cateLv2 = category[cateLv1[i]]
      for (const item of cateLv2) {
        cateId++
        await cateCollection.insertOne({ cateId, name: item, pid })
      }
    }
  } catch (err) {
    console.log('err message:', err)
  }
}

module.exports = {
  fetchCategory,
  updateCategory
}

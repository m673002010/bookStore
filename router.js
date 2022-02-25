const koaRouter = require('koa-router')
const router = new koaRouter()

// 登录
const loginController = require('./controller/loginController')
router.post('/login', loginController.login)

// 搜索
const searchController = require('./controller/searchController')
router.get('/search', searchController.search)

// 图书
const bookController = require('./controller/bookController')
router.get('/book/bookDetail', bookController.bookDetail)
router.get('/book/bookList', bookController.bookList)
router.post('/book/addBook', bookController.addBook)
router.get('/book/swiperList', bookController.swiperList)

// 分类
const cateController = require('./controller/cateController')
router.get('/cate/cateList', cateController.cateList)

// 上传文件
const uploadController = require('./controller/uploadController')
router.post('/upload/uploadPic', uploadController.uploadPic)

module.exports = router

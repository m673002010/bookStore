global.config = require('./config')
const path = require('path')
start()

async function start () {
    try {
        // 连接mongodb
        global.mongoDb = await require('./db').connectDb()

        // 连接redis
        global.redisClient = await require('./db/redis').connectRedis()

        // 启动定时任务
        require('./cron').start()

        // 引入中间件
        const Koa = require('koa')
        const KoaStatic = require('koa-static')
        const router = require('./router.js')
        // const bodyParser = require('koa-bodyparser')
        const koaBody = require('koa-body')
        const rq = require('./lib/req')
        const { checkLogin } = require('./middleware/checkLogin')

        const app = new Koa()
        app.use(koaBody({
            multipart: true,
            formidable: {
                maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认5M
            }
        }))

        // 获取静态资源
        app.use(KoaStatic(path.join(__dirname, './static/')))

        // 校验登录
        app.use(checkLogin)

        // 引入请求组件
        app.use(async (ctx, next) => {
            ctx.rq = rq
            await next()
        })

        // app.use(bodyParser())

        app.use(router.routes())

        app.listen(config.port)
        console.log('server start success...')
    } catch (err) {
        // 导致进程退出的错误
        console.log('process exit err:', err)
        process.exit(1)
    }
}

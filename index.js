const path = require('path')
start()

async function start () {
    try {
        global.config = require('./config')

        // 日志
        global.logger = require('./lib/logger')

        // 连接mongo
        global.mongoDb = await require('./db').connectDb()

        // 连接redis
        global.redisClient = await require('./db/redis').connectRedis()

        // 连接rabbitmq
        global.broker = await require('./lib/messageBroker').getInstance({
            vhost: 'bookStore',
            exchange: 'log_exchange',
            exType: 'topic',
            routeKey: 'bookStore.log'
        })

        // 启动定时任务
        require('./cron').start()

        // 引入、挂载中间件
        const Koa = require('koa')
        const KoaStatic = require('koa-static')
        const router = require('./router.js')
        const koaBody = require('koa-body')
        const rq = require('./lib/req')
        const { checkLogin } = require('./middleware/checkLogin')
        const { ctxLog } = require('./middleware/log')
        const { requestId } = require('./middleware/requestId')

        const app = new Koa()

        app.use(ctxLog)
        app.use(requestId)
        app.use(koaBody({
            multipart: true,
            formidable: {
                maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认5M
            }
        }))
        app.use(KoaStatic(path.join(__dirname, './static/')))
        app.use(checkLogin)
        app.use(async (ctx, next) => {
            ctx.rq = rq
            await next()
        })
        app.use(router.routes())

        // 启动服务监听端口
        app.listen(config.port)
        logger.log('server start success...')
    } catch (err) {
        // 导致进程退出的错误
        logger.log('process exit err:' + err.message, 'error')
        process.exit(1)
    }
}

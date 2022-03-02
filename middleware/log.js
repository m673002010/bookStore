async function ctxLog(ctx, next) {
    await next()

    const ip = ctx.ip.replace(/[^\d|\.]/g, "") || '0.0.0.0'
    const method = ctx.method || ''
    const url = ctx.url || ''
    const reqParam = JSON.stringify(Object.assign(ctx.request.query, ctx.request.body) || {}) 
    const res = JSON.stringify(ctx.body || {}) 

    // 日志的记录格式
    const logStr = `${ip} ${method} ${url} ${reqParam} ${res}`

    logger.log(logStr)

    // 将请求记录推送到logCenter
    broker.send({ ip, method, url, reqParam, res })
}

module.exports = {
    ctxLog
}

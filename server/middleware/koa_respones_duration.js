// 计算服务器耗时的中间件
module.exports = async (ctx, next) => {
    // 记录开始的时间
    const start = Date.now()
    // 执行中间件
    await next()
    // 记录结束时间
    const end = Date.now()
    const duration = end - start
    // 设置响应头  X-Response-Time
    ctx.set("X-Response-Time", duration + "ms")
}
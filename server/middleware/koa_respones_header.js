// 处理响应头的中间件
module.exports = async (ctx, next) => {
    const contentType = "application/json;charset=UTF-8"
    ctx.set("Content-Type", contentType)
    ctx.response.body = "{success}: true"
    await next
}
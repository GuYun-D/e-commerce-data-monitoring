const koa = require("koa")
// 创建koa对象
const app = new koa()
/**
 * 编写响应函数（中间件）
 * ctx: 上下文，web容器
 *          ctx.request 请求对象
 *          ctx.response 响应对象
 * next：下一个中间件
 */
// app.use((ctx, next) => {
//     console.log(ctx.request.url);
//     ctx.response.body = "hello world"
// })

/**
 * 总耗时中间件，第一层中间件
 */
const respDurationMiddleware = require("./middleware/koa_respones_duration")
app.use(respDurationMiddleware)


// 监听端口
app.listen(3000)
console.log("服务器已启动.....................");
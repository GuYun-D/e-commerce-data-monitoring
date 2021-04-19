const path = require("path")
const fileUtils = require("../utils/files_utils")

// 处理业务逻辑中间件
module.exports = async (ctx, next) => {
    const url = ctx.request.url
    console.log(url);
    let filePath = url.replace('/api', '')
    filePath = "../data" + filePath + ".json"
    filePath = path.join(__dirname, filePath)
    // 使用try-catch
    try {
        const ret = await fileUtils.getFilesJsonData(filePath)
        ctx.response.body = ret
    } catch (error) {
        const erroeMessage = {
            message: "读取文件内容失败，文件资源不存在",
            status: 404
        }

        ctx.response.body = JSON.stringify(erroeMessage)
    }

    console.log("真正的路径" + filePath);
    // 读取文件内容
    await next()
}
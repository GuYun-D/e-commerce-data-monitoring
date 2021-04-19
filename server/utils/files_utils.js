// 读取文件的工具方法

const fs = require("fs")
module.exports.getFilesJsonData = (filePath) => {
    // 根据文件路径读取文件的内容
    // 异步任务，使用promise
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                // 读取文件失败
                reject(err)
            } else {
                // 文件读取成功
                resolve(data)
            }
        })
    })
}
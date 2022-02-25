const fs = require('fs')
const path = require('path')


async function uploadPic (ctx, next) {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件

    if (file) {
        // 创建可读流
        const reader = fs.createReadStream(file.path)
        let filePath = path.join(__dirname, '../static') + `/${file.name}`

        // 创建可写流
        const upStream = fs.createWriteStream(filePath)

        // 可读流通过管道写入可写流
        reader.pipe(upStream)
    }

    ctx.body = {
        code: 0,
        message: '图书上传成功',
        data: {
            imageSrc: 'http://192.168.43.141:3000/' + file.name
        }
    }
}

module.exports = {
    uploadPic
}

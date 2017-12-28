const qiniu = require('qiniu')
const path = require('path')
const url = require('url')

const PutPolicy = qiniu.rs.PutPolicy
const PutExtra = qiniu.io.PutExtra

// 上传策略函数
const uptoken = (bucket, key) => new PutPolicy(`${bucket}:${key}`).token()

// 默认参数
const formatParam = (file, mdFileName) => {
    const dt = new Date()
    const y = dt.getFullYear()
    const m = dt.getMonth() + 1
    const d = dt.getDate()
    const h = dt.getHours()
    const mm = dt.getMinutes()
    const s = dt.getSeconds()

    const date = `${y}${m}${d}`
    var ext = path.extname(file)

    return {
        date,
        dateTime: `${date}${h}${mm}${s}`,
        fileName: path.win32.basename(file, ext),
        ext,
        mdFileName
    }
}

const formatString = (tplString, data) => {
    const keys = Object.keys(data)
    const values = keys.map(k => data[k])

    return new Function(keys.join(','), 'return `' + tplString + '`').apply(null, values)
}

module.exports = ({
    access_key,
    secret_key,
    bucket,
    domain,
    remotePath }, file, mdFile) => {

    qiniu.conf.ACCESS_KEY = access_key
    qiniu.conf.SECRET_KEY = secret_key

    let localFile = file
    if (/^".+"$/.test(localFile)) {
        localFile = file.substring(1, file.length - 1)
    }

    // 预设参数值
    const param = formatParam(localFile, mdFile)
    //上传到七牛后保存的文件名
    const saveFile = formatString(remotePath + '${ext}', param)
    //生成上传 Token
    const token = uptoken(bucket, saveFile)

    return new Promise((resolve, reject) => {

        const extra = new PutExtra()

        qiniu.io.putFile(token, saveFile, localFile, extra, (err, { key }) => {

            if (!err) {
                // 上传成功， 处理返回值
                resolve({
                    name: path.win32.basename(key, param.ext),
                    url: url.resolve(domain, saveFile)
                })
            } else {
                // 上传失败， 处理返回代码
                reject(err)
            }
        })
    })
}



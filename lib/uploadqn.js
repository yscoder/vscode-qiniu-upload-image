const qiniu = require('qn')
const path = require('path')
const url = require('url')

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
        fileName: path.basename(file, ext),
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

    var client = qiniu.create({
        accessKey: access_key,
        secretKey: secret_key,
        bucket: bucket,
        origin: domain,
        // timeout: 3600000, // default rpc timeout: one hour, optional
        // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
        // uploadURL: 'http://up.qiniu.com/',
        });

    // 预设参数值
    const param = formatParam(file, mdFile)
    //上传到七牛后保存的文件名
    const saveFile = formatString(remotePath + '${ext}', param)

    return new Promise((resolve, reject) => {

        // upload a file with custom key
        client.uploadFile(file, {key: saveFile}, function (err, res) {
            if (!err) {
                // 上传成功， 处理返回值
                resolve({
                    name: path.basename(res.key, param.ext),
                    url: url.resolve(domain, saveFile)
                })
            } else {
                // 上传失败， 处理返回代码
                reject(err)
            }
        });
    })
}



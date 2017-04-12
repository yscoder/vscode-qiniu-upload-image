var qiniu = require('qiniu');
var path = require('path');
var url = require('url');
var paramExp = /\${(\w+)}/g;

// 上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key);
    return putPolicy.token();
}

// 默认参数
function fileParam(file, mdFile){
    var dt = new Date();
    var y = dt.getFullYear();
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    var h = dt.getHours();
    var mm = dt.getMinutes();
    var s = dt.getSeconds();
    var ap = Array.prototype;

    var date = y + '' + m + '' + d;
    var ext = path.extname(file);

    return {
        date: date,
        dateTime: date + '' + h + '' + mm + '' + s,
        fileName: path.basename(file, ext),
        ext: ext,
        mdFileName: mdFile
    }
}

module.exports = function(config, file, mdFile) {
    qiniu.conf.ACCESS_KEY = config.access_key;
    qiniu.conf.SECRET_KEY = config.secret_key;

    //要上传的空间
    var bucket = config.bucket;

    var domain = config.domain;

    //要上传文件的本地路径
    var localFile = file;
    
    var param = fileParam(file, mdFile);
    
    //上传到七牛后保存的文件名
    var remotePath = (config.remotePath + '${ext}').replace(paramExp, function(exp, prop){
        return param[prop] || '';
    });


    //生成上传 Token
    var token = uptoken(bucket, remotePath);

    return new Promise(function(resolve, reject) {

        var extra = new qiniu.io.PutExtra();

        qiniu.io.putFile(token, remotePath, localFile, extra, function(err, ret) {

            if(!err) {
                // 上传成功， 处理返回值
                resolve({
                    name: path.basename(ret.key, param.ext),
                    url: url.resolve(domain, remotePath)
                });
                     
            } else {
                // 上传失败， 处理返回代码
                reject(err);
            }

        });
    })

}



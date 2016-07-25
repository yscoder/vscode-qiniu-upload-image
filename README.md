# qiniu-upload-image

一个VS Code插件，写Markdown时可以快捷上传本地图片获取七牛图床外链。

## Features

![priview](http://7ximpj.com1.z0.glb.clouddn.com/vscode-qiniu-pv.gif)

> Tip: 只有在编辑Markdown时插件才可使用，启动快捷键 Windows `Ctrl+Q`，Mac `cmd+q`。

## User Settings

| properties | type   |  default  | description  |
| --------   | :----:  | :----:  |  :----:  |
| qiniu.enable | boolean |  false  | 插件开关 |
| qiniu.access_key |  string   |      | 一个有效的七牛 AccessKey 签名授权 |
| qiniu.secret_key |  string  |    | 一个有效的七牛 SecretKey 签名授权 |
| qiniu.bucket |  string  |    | 七牛图片上传空间 |
| qiniu.remotePath |  string  |  `${fileName}` | 七牛图片上传路径，参数化命名，暂时支持 `${fileName}`、`${date}`、`${dateTime}`，如：`${fileName}-${date}` 生成格式为 `picName-20160725.jpg`|
| qiniu.domain |  string  |    | 七牛图床域名 |


## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

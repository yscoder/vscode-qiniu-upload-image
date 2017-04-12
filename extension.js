const { window, commands, workspace } = require('vscode')
const path = require('path')
const qnUpload = require('./lib/upload')

// this method is called when your extension is activated
exports.activate = context => {

    console.log('qiniu-upload-image is active!')

    const config = workspace.getConfiguration('qiniu')

    if (!config.enable) return

    const disposable = commands.registerCommand('extension.qiniu.upload', () => {

        const editor = window.activeTextEditor
        const mdFilePath = editor.document.fileName
        const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath))

        if (!editor) {
            window.showErrorMessage('没有打开编辑窗口')
            return
        }

        window.showInputBox({
            placeHolder: '输入一个本地图片地址'
        }).then(path => qnUpload(config, path, mdFileName)
            , err => {
                window.showErrorMessage(err)
            }
            ).then(({ name, url }) => {
                console.log('Upload success!')

                const img = `![${name}](${url})`
                editor.edit(textEditorEdit => {
                    textEditorEdit.insert(editor.selection.active, img)
                })
            }, err => {
                window.showErrorMessage(err)
            })
    })

    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
exports.deactivate = () => { }

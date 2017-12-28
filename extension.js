const { window, commands, workspace } = require('vscode')
const path = require('path')
const qnUpload = require('./lib/upload')

const upload = (config, fsPath) => {
    if(!fsPath) return

    const editor = window.activeTextEditor
    const mdFilePath = editor.document.fileName
    const mdFileName = path.win32.basename(mdFilePath, path.extname(mdFilePath))

    return qnUpload(config, fsPath, mdFileName).then(({ name, url }) => {
        console.log('Upload success!')

        const img = `![${name}](${url})`

        editor.edit(textEditorEdit => {
            textEditorEdit.insert(editor.selection.active, img)
        })
    })
}

const error = err => {
    window.showErrorMessage(err)
}

// this method is called when your extension is activated
exports.activate = context => {

    console.log('qiniu-upload-image is active!')

    const config = workspace.getConfiguration('qiniu')

    if (!config.enable) return

    const inputUpload = commands.registerCommand('extension.qiniu.upload', () => {

        if (!window.activeTextEditor) {
            window.showErrorMessage('没有打开编辑窗口')
            return
        }

        window.showInputBox({
            placeHolder: '输入一个本地图片地址'
        })
        .then(fsPath => upload(config, fsPath), error)
    })

    const selectUpload = commands.registerCommand('extension.qiniu.select', () => {
        window.showOpenDialog({
            filters: { 'Images': ['png', 'jpg', 'gif', 'bmp'] }
        }).then(result => {
            if (result) {
                const { fsPath } = result[0]
                return upload(config, fsPath)
            }
        }, error)
    })

    context.subscriptions.push(inputUpload)
    context.subscriptions.push(selectUpload)
}

// this method is called when your extension is deactivated
exports.deactivate = () => { }

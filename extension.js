// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var qnUpload = require('./lib/upload');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "qiniu-upload-image" is now active!');
    var window = vscode.window;
    var config = vscode.workspace.getConfiguration('qiniu');
    

    if(!config.enable) return;

    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.qiniu.upload', function () {
        // The code you place here will be executed every time your command is executed

        var editor = window.activeTextEditor;

        if (!editor) {
            window.showErrorMessage("没有打开编辑窗口");
            return;
        }

        // Display a message box to the user
        //vscode.window.showInformationMessage('插件就绪!');
        window.showInputBox({
            placeHolder: '输入一个本地图片地址'
        }).then(function(path){

            return qnUpload(config, path);

        }, function(err){

           window.showErrorMessage(err);

        }).then(function(ret){

            var img = '!['+ ret.name +']('+ ret.url +')';
            editor.edit(function(textEditorEdit) {
                textEditorEdit.insert(editor.selection.active, img);
            })

        }, function(err){

            window.showErrorMessage(err);

        });
        
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
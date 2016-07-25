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

    var config = vscode.workspace.getConfiguration('qiniu');

    if(!config.enable) return;
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.qiniu.upload', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        //vscode.window.showInformationMessage('插件就绪!');
        vscode.window.showInputBox({
            placeHolder: '输入一个本地图片地址'
        }).then(function(path){
            return qnUpload(config, path);
        }, function(err){
           vscode.window.showErrorMessage(err);
        }).then(function(ret){
            vscode.window.showInformationMessage(ret);
        }, function(err){
            vscode.window.showErrorMessage(err);
        });
        
        //vscode.commands.executeCommand('vscode.workbench.action.files.openFile')
        //console.log(vscode.clipboard.getContent());
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
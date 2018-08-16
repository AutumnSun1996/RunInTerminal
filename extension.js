// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('extension "RunInTerminal" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.RunInTerminal', function () {
        // The code you place here will be executed every time your command is executed
        runCommand(vscode.window.activeTextEditor);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    Terminal.dispose();
}
exports.deactivate = deactivate;

// Static class that creates and holds a reference to a terminal and can run commands in it.
class Terminal {
    static _terminal() {
        if (!Terminal.terminal) {
            Terminal.terminal = vscode.window.createTerminal(Terminal.terminalName);
            Terminal.terminal.show(true);
            // if user closes the terminal, delete our reference:
            vscode.window.onDidCloseTerminal((event) => {
                if (Terminal._terminal() && event.name === Terminal.terminalName) {
                    Terminal.terminal = undefined;
                }
            });
        }
        return Terminal.terminal;
    }
    static run(command) {
        if (!command) {
            return;
        }
        console.log(`Run In Terminal: Run: ${command}`);
        Terminal._terminal().show(true);
        Terminal._terminal().sendText(command, true);
    }
    static dispose() {
        if (Terminal.terminal) {
            Terminal.terminal.dispose();
            Terminal.terminal = undefined;
        }
    }
}
Terminal.terminalName = 'Run In Terminal';

class CommandEnv {
    constructor(editor) {
        this.editor = editor;
    }

    accept(command) {
        if (!command.match) {
            return true;
        }
        var pattern = command.match;
        try {
            return new RegExp(pattern).test(this.editor.document.fileName);
        } catch (e) {
            console.log(e.stack);
            showError(`invalid match pattern: ${pattern}`);
            return false;
        }
    }

    build(command) {
        if (!command) {
            return null;
        }
        var extName = path.extname(this.editor.document.fileName);
        var relativeFile = "." + this.editor.document.fileName.replace(vscode.workspace.rootPath, "");
        var line = this.editor.selection.active.line + 1;
        var column = this.editor.selection.active.character + 1;
        command = command.replace(/\${line}/g, `${line}`);
        command = command.replace(/\${column}/g, `${column}`);
        command = command.replace(/\${relativeFile}/g, relativeFile);
        command = command.replace(/\${file}/g, `${this.editor.document.fileName}`);
        command = command.replace(/\${workspaceRoot}/g, `${vscode.workspace.rootPath}`);
        command = command.replace(/\${fileBasename}/g, `${path.basename(this.editor.document.fileName)}`);
        command = command.replace(/\${fileDirname}/g, `${path.dirname(this.editor.document.fileName)}`);
        command = command.replace(/\${fileExtname}/g, `${extName}`);
        command = command.replace(/\${fileBasenameNoExt}/g, `${path.basename(this.editor.document.fileName, extName)}`);
        command = command.replace(/\${cwd}/g, `${process.cwd()}`);
        // replace environment variables ${env.Name}
        command = command.replace(/\${env\.([^}]+)}/g, (sub, envName) => {
            return process.env[envName] || "";
        });
        return command;
    }
}

function showError(msg) {
    vscode.window.showErrorMessage(`Run In Terminal: ${msg}`);
}

function runCommand(editor) {
    if (!editor) {
        console.log("Run In Terminal: no editor.");
        return;
    }
    var cfg = vscode.workspace.getConfiguration('RunInTerminal');
    var commands = cfg.get("commands");
    var saveBeforeRun = cfg.get("saveBeforeRun");
    if (saveBeforeRun) {
        console.log("SaveAll");
        // 使用Promise保证文件保存后才开始运行命令
        Promise.resolve(editor.document.save()).then((result)=>{
            console.log("Saved:", result);
            doRunCommands(commands);
        });
    } else {
        doRunCommands(commands);
    }
}
function doRunCommands(commands){
    var commandEnv = new CommandEnv(vscode.window.activeTextEditor);
    for (var command of commands) {
        console.log("Check:", JSON.stringify(command));
        if (commandEnv.accept(command)) {
            Terminal.run(commandEnv.build(command.cmd));
            if (!command.keepGoing) {
                break;
            }
        }
    }
}
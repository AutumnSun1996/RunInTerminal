# RunInTerminal

This extension is a edited version of "Run In Terminal" by kortina.

Instead of the args in `keybidings`, it only use `setting` for configuration.

I also add `saveBeforeRun` function, and allow multiple commands by `KeepGoing` attribute.

## Features

Run user defined commands in terminal accoding to filename regex. The default shortcut is `shift+f10`, and you can change it in keybindings.

Allow multiple commands by `KeepGoing` attribute in command setting.

## Extension Settings

Here is an example.
```json
    "RunInTerminal": {
        "saveBeforeRun": true,
        "commands": [
            {
                "cmd": "cd ${fileDirname}",
                "keepGoing": true
                // change to current working dir
            },
            {
                "cmd": "clear",
                "keepGoing": true
                // clear screen
            },
            {
                "match": "\\.js$",
                "cmd": "node ${fileBasename}"
                // if match passed, this cmd will be executed and then exit.
            },
            {
                "match": "\\.txt$"
                // if match passed, it will exit.
            },
            {
                "cmd": "xdg-open ${fileBasename}"
                // only executed when not js or txt.
            }
        ]
    }
```

If `saveBeforeRun` is true, the current file will be saved before any commands begin.

Then, `RunInTerminal` will check each command defined in `commands`. 

For items with `match` attribute, the command will only be excuted when the name of current file matches the regex in `match`.

If name match failed, RunInTerminal will go to next command.

And if name match passed or there are no match attribute, RunInTerminal will go to next command only if `keepGoing` here is true. Else, it will exit.

## Substitution Tokens

You can use the following substition tokens in cmd strings:

* ${column}
* ${cwd}
* ${env.<Name>} // replace environment variables
* ${file}
* ${fileBasename}
* ${fileBasenameNoExt}
* ${fileDirname}
* ${fileExtname}
* ${line}
* ${relativeFile}
* ${workspaceRoot}

## Release Notes

### 0.0.1

- Initial release

### 0.0.2

- Add Function: Scroll to bottom of the terminal before execution of commands.


**Enjoy!**

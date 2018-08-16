# RunInTerminal README

This is the README for extension "RunInTerminal".

The extension is a edited version of "Run In Terminal" by kortina.

## Features

Run user defined commands in terminal accoding to filename regex. The default shortcut is "shift+f10", and you can change it in keybindings. 

Allow multi-commands by "KeepGoing" attribute in command setting.

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
                // if match passed, it will be executed this cmd and exit.
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

If name match failed, `RunInTerminal` will go to next command.

And if name match passed or there are no match attribute, `RunInTerminal` will go to next command only if `keepGoing` here is true. Else, it will exit.

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

### 1.0.0

Initial release

**Enjoy!**

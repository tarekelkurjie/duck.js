const Arguments = require('./arguments/arguments');

function parse(text) {
    let Args;
    let command = text.split(' ')[0];
    switch (command) {
        case "/obama":
            Args = new Arguments(command, ["-S", "--minsize", "--maxsize"]);
            break;
        case "/help":
            alert("Usage: /obama <number> -S <size> --minsize <minimum size> --maxsize <maximum size> \n \n See documentation on GitHub for all uses");
            break;
    }

    let res = Args.getValues(text)
    console.log(res);
    return res;
}

module.exports = parse;
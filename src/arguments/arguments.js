let int = require('./parseint');

class Arguments {
    args = [];
    command;
    
    constructor (command, possibleArgs) {
        if (Array.isArray(possibleArgs)) {
            this.command = command;
            for (let i = 0; i < possibleArgs.length; i++) {
                this.args.push(possibleArgs[i]);    
            }
        } else {
            throw new Error ('Invalid type of arguments. Expected an array.')
        }
    }

    getValues (text) {
        let results = {};
        let split = text.split(' ');
        console.log(split);
        for (let i = 0; i < split.length; i++) {
            if (this.args.includes(split[i])) {
                if ((this.args.includes(split[i + 1]) || !split[i + 1]) && split[i] != this.command) {
                    throw new Error (`No value assigned to variable ${split[i]}. Use /help for set of uses and variables.`);
                } else {
                    results[split[i]] = int(split[i + 1]);
                    i++;
                }
            } else if (split[i] === this.command && (!this.args.includes(split[i + 1]) && split[i + 1])) {
                results["default"] = int(split[i + 1])
            } else if (!this.args.includes(split[i - 1]) && split[i-1] != this.command){
                throw new Error (`Variable ${split[i]} not found. Use /help for set of uses and variables.`);
            }
        }
        return results;
    }
}

module.exports = Arguments;

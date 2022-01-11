/*
* Copyright © 2022 Joey Malvinni
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
* http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Modifications copyright © 2022 Tarek Elkurjie
*/




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
        
        for (let i = 0; i < split.length; i++) {
            if (this.args.includes(split[i])) {
                if ((this.args.includes(split[i + 1]) || !split[i + 1]) && split[i] != this.command) {
                    throw new Error (`No value assigned to variable '${split[i]}'. Use /help for set of uses and variables.`);
                } else {
                    results[split[i]] = int(split[i + 1]);
                    i++;
                }
            } else if (split[i] === this.command && (!this.args.includes(split[i + 1]) && split[i + 1])) {
                results["default"] = int(split[i + 1])
            } else if (!this.args.includes(split[i - 1]) && split[i-1] != this.command){
                throw new Error (`Variable '${split[i]}' not found. Use /help for set of uses and variables.`);
            }
        }

        if (results['--minsize'] || results['--maxsize']) {
            let sizeVar = results['--minsize'] ? '--minsize' : '--maxsize';
            let oppVar = sizeVar == '--minsize' ? '--maxsize' : '--minsize';
            if (!results['--maxsize'] || !results['--minsize']) {
                throw new Error (`Variable '${sizeVar}' does not have matching '${oppVar}' variable.`)
            }
        }
        return results;
    }
}

module.exports = Arguments;

function int (str) {
    let parsed = parseInt(str);
    return isNaN(parsed) ? str : parsed;
}

module.exports = int; 

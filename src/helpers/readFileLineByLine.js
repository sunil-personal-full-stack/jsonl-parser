const fs = require('fs');
const readline = require('readline');

const readFileLineByLine = (filePath, onLine, onClose) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    rl.on('line', onLine);
    rl.on('close', onClose);
};

module.exports = readFileLineByLine;

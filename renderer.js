var runner = require('./runner')();
var el = document.getElementById("imageDropInput");


function buildCmd(binary, inputFile, outputFile, language, psmValue, trainingDataDirectory) {
    var cmd = [binary, inputFile, outputFile, "-l " + language, "-psm " + psmValue, "--tessdata-dir " + trainingDataDirectory];
    return cmd.join(' ');
}

function processFile(file) {
    runner.getText(file.path, file.name);
}

var initDragNDrop = function () {

};

if ('draggable' in document.createElement('span')) {
    initDragNDrop();
}

el.addEventListener('change', function () {
    if (el.files.length > 0) {
        processFile(el.files[0]);
    }
});
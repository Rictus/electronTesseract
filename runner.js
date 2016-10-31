var fs = require('fs');
var exec = require('child_process').exec;

function buildCmd(binary, inputFile, outputFile, language, psmValue, trainingDataDirectory) {
    var cmd = [binary, inputFile, outputFile,
        " -l " + language,
        " -psm " + psmValue,
        " --tessdata-dir " + trainingDataDirectory];
    return cmd.join(' ');
}

function runCmd(cmd) {
    console.log("Gonna run : " + cmd);
    exec(cmd, function callback(error, stdout, stderr) {
        if (error) {
            throw error;
        } else {
            console.log("ERROR : " + stderr);
            console.log(stdout);
        }
    });
}

var merge = function (defaults, options) {
    defaults = defaults || {};
    if (options && typeof options === 'object') {
        var i = 0,
            keys = Object.keys(options);

        for (i = 0; i < keys.length; i += 1) {
            if (options[keys[i]] !== undefined) {
                defaults[keys[i]] = options[keys[i]];
            }
        }
    }
    return defaults;
};

module.exports = function (opts) {
    if (typeof opts !== "object") {
        opts = {};
    }

    var defaultsOpts = {
        binaryPath: "tesseract",
        imageDirectory: "./img/",
        textDirectory: "./txt/",
        trainingDataDirectory: "./trainingData/"
    };

    var options = merge(defaultsOpts, opts);

    try {
        console.log("Checking image directory");
        fs.accessSync(options.imageDirectory, fs.F_OK);
    } catch (e) {
        fs.mkdir(options.imageDirectory)
    }

    try {
        console.log("Checking text directory");
        fs.accessSync(options.textDirectory, fs.F_OK);
    } catch (e) {
        fs.mkdir(options.textDirectory)
    }

    try {
        console.log("Checking binary path");
        fs.accessSync(options.binaryPath, fs.F_OK);
    } catch (e) {
        throw e;
    }

    /**
     * fs.js:101 Uncaught Error: ENOENT: no such file or directory,
     * rename
     * 'C:\Users\Dylan\Desktop\Dossier Privé Dylan\Images\Higgs exist.png' ->
     * 'C:\Users\Dylan\WebstormProjects\electronTesseract\img\
     * C:\Users\Dylan\Desktop\Dossier Privé Dylan\Images\Higgs exist.png'
     */

    try {
        console.log("Checking training data directory");
        fs.accessSync(options.trainingDataDirectory, fs.F_OK);
    } catch (e) {
        throw e;
    }


    return {

        LANGUAGES: {
            FR: 'fr',
            ENG: 'eng'
        },
        getText: function (filepath, filename) {
            var outputTextFile = options.textDirectory + filename + ".txt";
            var imgPath = options.imageDirectory + filename;


            console.log("given filepath : " + filepath);
            console.log("filename : " + filename);
            console.log("Image was moved to " + imgPath);
            console.log("The text file location is " + outputTextFile);

            fs.rename(filepath, imgPath);
            var cmd = buildCmd(options.binaryPath, imgPath, outputTextFile, 'eng', 3, options.trainingDataDirectory);
            console.log(cmd);
            runCmd(cmd);
        }
    };
};
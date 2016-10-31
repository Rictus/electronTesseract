var fs = require('fs');
var exec = require('child_process').exec;

var buildCmd = function (binary, inputFile, outputFile, language, psmValue, trainingDataDirectory) {
    var cmd = [binary, "\"" + inputFile + "\"", outputFile,
        " -l " + language,
        " -psm " + psmValue,
        " --tessdata-dir " + trainingDataDirectory];
    return cmd.join(' ');
};

var runCmd = function (cmd, cb) {
    console.log("Gonna run : " + cmd);
    exec(cmd, cb);
};

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
        fs.accessSync(options.imageDirectory, fs.F_OK);
    } catch (e) {
        fs.mkdir(options.imageDirectory)
    }

    try {
        fs.accessSync(options.textDirectory, fs.F_OK);
    } catch (e) {
        fs.mkdir(options.textDirectory)
    }

    try {
        fs.accessSync(options.binaryPath, fs.F_OK);
    } catch (e) {
        throw e;
    }

    try {
        fs.accessSync(options.trainingDataDirectory, fs.F_OK);
    } catch (e) {
        throw e;
    }

    return {

        LANGUAGES: {
            FR: 'fr',
            ENG: 'eng'
        },
        getText: function (filepath, filename, cb) {
            // Tesseract only output to a text file
            var outputTextFile = options.textDirectory + filename;
            outputTextFile = outputTextFile.replace(new RegExp(" ", 'g'), "_");
            var tmpImgPath = options.imageDirectory + filename;
            fs.createReadStream(filepath).pipe(fs.createWriteStream(tmpImgPath));
            var cmd = buildCmd(options.binaryPath, tmpImgPath, outputTextFile, 'eng', 3, options.trainingDataDirectory);
            runCmd(cmd, function callback(error, stdout, stderr) {
                if (error) {
                    throw error;
                } else {
                    fs.unlink(tmpImgPath);
                    cb(fs.readFileSync(outputTextFile + ".txt", 'utf8'));
                }
            });
        }
    };
};
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
    console.log(cmd);
    console.time("running_cmd");
    var callback = function (error, stdout, stderr) {
        console.timeEnd("running_cmd");
        cb(error, stdout, stderr);
    };
    exec(cmd, callback);
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

var moveFileTmp = function (inputPath, outputPath) {
    if (inputPath === outputPath) {
        return false;
    } else {
        fs.createReadStream(inputPath).pipe(fs.createWriteStream(outputPath));
        return true;
    }
};

module.exports = function (opts) {
    if (typeof opts !== "object") {
        opts = {};
    }

    var defaultsOpts = {
        binaryPath: "tesseract",
        imageDirectory: "./tmp/img/",
        textDirectory: "./tmp/txt/",
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
            moveFileTmp(filepath, tmpImgPath);
            var cmd = buildCmd(options.binaryPath, filepath, outputTextFile, 'eng', 3, options.trainingDataDirectory);
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
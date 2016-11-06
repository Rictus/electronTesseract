var config = require('./config.json');
var http = require('http');
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express(http);

var ocr = require('./src/ImageOCR')();

app.use(fileUpload({
    fileSize: config.server.maxFileSize,
    file: config.server.maxNumberOfFiles
}));

app.use(express.static('public'));
app.use(express.static('src'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index_server.html");
});

app.post('/imageUpload', function (req, res) {
    var userReponseError = function (errorCode) {
        if (errorCode in config.server.errors) {
            res.status(config.server.errors[errorCode].code).send(config.server.errors[errorCode].text);
        } else {
            console.error("The key '" + errorCode + "' doesn't exist in configuration file.");
            res.status(config.server.errors["InternalError"].code).send(config.server.errors["InternalError"].text);
        }
    };

    var checkMimeType = function (mimeType, onMimeTypeOK) {
        if (config.server.supportedMimeTypes.indexOf(mimeType) >= 0) {
            onMimeTypeOK();
        } else {
            userReponseError("wrongMimeType");
        }
    };
    var moveFileToTmp = function (file, onMoveSuccess) {
        var destinationPath = config.server.tmpDirectoryPath + sampleFile.name;
        file.mv(destinationPath, function (err) {
            if (err) {
                console.error(err);
                userReponseError("InternalError");
            } else {
                onMoveSuccess(destinationPath);
            }
        });
    };

    var cbOcrResponse = function (txt) {
        if (typeof txt === "string" && txt.length > 0 && !(/^\s*$/g.test(txt))) {
            res.status(200).send(txt);
        } else {
            userReponseError("noTextFound");
        }
    };

    var sampleFile;
    var objFiles = typeof req.files === "object" ? req.files : req.file;
    if (typeof objFiles !== "object") {
        userReponseError("noFileUploaded");
    } else if (typeof objFiles.image !== "object") {
        userReponseError("WrongParamName");
    } else {
        sampleFile = objFiles.image;
    }
    checkMimeType(sampleFile.mimetype, function () {
        moveFileToTmp(sampleFile, function (filePath) {
            ocr.getText(filePath, sampleFile.name, cbOcrResponse);
        });
    })
});

app.listen(8090, function () {
    console.log('http://localhost:8090');
});
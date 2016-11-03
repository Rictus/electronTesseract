var http = require('http');
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express(http);

var ocr = require('./src/ImageOCR')();

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.static('src'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index_server.html");
});

app.post('/imageUpload', function (req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.image;
    var destPath = './tmp/img/' + sampleFile.name;
    if (sampleFile.mimetype.substr(0, "image".length) === "image") {
        sampleFile.mv(destPath, function (err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                ocr.getText(destPath, sampleFile.name, function (txt) {
                    res.send(typeof txt === "string" && txt.length > 0 ? txt : "No text found.");
                });
            }
        });
    } else {
        res.send('Wrong file type, only image allowed.');
    }
});

app.listen(8090, function () {
    console.log('Listening on port 8090!');
});
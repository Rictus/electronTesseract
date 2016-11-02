var http = require('http');
var express = require('express');
var app = express(http);

app.use(express.static('public'));
app.use(express.static('src'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index_server.html");
});

app.listen(8090, function () {
    console.log('Listening on port 8090!');
});
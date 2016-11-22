var express = require('express');
var app = express();
var request = require('request');
var url = require('url');
var prettyjson = require('prettyjson');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var server = require('http').createServer(app);




app.get('/', /*authenticate,*/ function(req, res){
		//authenticate(req, res, function(res){
			res.sendFile(__dirname + '/index.html');
		//});
	});


app
	.use("/", express.static(__dirname + '/'))
	.use('/js', express.static(__dirname + '/js'))
	.use('/controllers', express.static(__dirname + '/controllers'))
	.use('/css', express.static(__dirname + '/css'))
	.use('/directives', express.static(__dirname + '/directives'))
	.use('/views', express.static(__dirname + '/views'));






server.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

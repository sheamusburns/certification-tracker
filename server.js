var express = require('express');
var chaperone = express();
var request = require('request');
var url = require('url');
var prettyjson = require('prettyjson');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var Firebase = require('firebase');
var myFirebaseRef = new Firebase('https://blinding-inferno-9862.firebaseio.com');
var server = require('http').createServer(chaperone);



chaperone
	.use("/", express.static(__dirname + '/'))
	.use('/js', express.static(__dirname + '/js'))
	.use('/controllers', express.static(__dirname + '/controllers'))
	.use('/css', express.static(__dirname + '/css'))
	.use('/directives', express.static(__dirname + '/directives'))
	.use('/views', express.static(__dirname + '/views'));

chaperone.get('/', function(req, res){
		res.sendFile(__dirname + '/index.html');
	});


chaperone.get('/facstaff', function(req, res){
	
	var page = 1;
	var pageString = "page=";
	var tempData = [];
	var count = 0;
	var runCount = 0;
	var options = {};

	var options = function(){
		return {
			protocol: 'http:',
			host: 'api.veracross.com',
			pathname: '/lville/v2/facstaff.json',
			auth: 'api.lville:zBzwdvnvkv',
			query: {'page' : page.toString()}
		}
	};

	var veracrossUrl = url.format(options());
	prepFacstaffData();

	

	function prepFacstaffData() {
		request(veracrossUrl, function(error, response, body){
			count = Math.ceil(Number(response.headers['x-total-count'])/100);
			if (count === NaN) {
				count = 10;
			}
			console.log(count);
			for (var i = 0; i < 8; i++) {
				getFacstaffData(i);
			}
		});
	}

	function getFacstaffData(i) {
		request(veracrossUrl, function(error, response, body) {
			tempData = tempData.concat(JSON.parse(body));
			this.count = (i+1);
			runCount ++;
			console.log(this.count + " of " + count + " complete");
			if (runCount == count) {
				res.json(JSON.stringify(tempData));
			}
			
		});
		page ++;
		veracrossUrl = url.format(options());
	}

});

server.listen(8080);

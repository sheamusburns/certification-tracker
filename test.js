var request = require('request');
var url = require('url');

var options = {
	protocol: 'http:',
	host: 'lville.api:zBzwdvnvkv@api.veracross.com',
	pathname: '/lville/v2/facstaff.json'
}

var veracrossUrl = url.format(options);
request(veracrossUrl).on('response', function(response){
	console.log(response);
});
var processSiteOne = require('node-car-scraper');
var processSite = require('node-car-scraper');
var S = require('string').extendPrototype();

processSiteOne('http://www.google.com',one,two,three);
processSite('http://www.reddit.com', oneb, two, three, four);

function one (err, $, cb) {
	var arr = ['http://www.yahoo.com', 'http://www.twitter.com', 'http://www.newegg.com'];
	return cb(arr);
}

function oneb (err, $, cb) {
	var arr = ['http://www.epic.com', 'http://nodejs.org']; 
	return cb(arr);
}

function two (err, $, cb) {
	var arr = [];
	$('a').each(function (i, elem) {
		temp = $(elem).attr('href');
		if (temp.startsWith('http') && !temp.endsWith('tar.gz')) {
			arr.push(temp);
		}
	});
	cb(arr);
	return;
}

function three (err,$,cb) {
	return(cb());
}

function four () {
	console.log('HOLY SHIT!!');
}

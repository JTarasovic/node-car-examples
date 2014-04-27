var cheerio = require('cheerio');
var db = require('mongodb').MongoClient;
var server = require('connect');
var http = require('http');
var fs = require('fs');
var async = require('async');
var S = require('string');
var url = require('url');
var path = require('path');
var money = require('accounting');
var file;

var $table = {};
var $tbody = {};
//var fullSite = {}


// hacky method to handle the static requests - css + js
function handleStatic(pageUrl, response) {
	var filename = path.join(process.cwd(), pageUrl);
	path.exists(filename, function (exists) {
		if (!exists) {
			console.log("not exists: " + filename);
			response.writeHead(404, {
				'Content-Type': 'text/html'
			});
			response.write('404 Not Found\n');
			response.end();
			return;
		}
		//Do not send Content type, browser will pick it up.
		response.writeHead(200);

		var fileStream = fs.createReadStream(filename);
		fileStream.on('end', function () {
			response.end();
		});

		fileStream.pipe(response);
		return;
	});
}

// add a row to the table for each vehicle
function addRows(err, results) {
	if (err) {
		console.log(err);
	}
	for (var i = results.length - 1; i >= 0; i--) {
		//console.log(results[i].VIN);
		$tbody.append('<tr />').children('tr').last()
			.append("<td>" + results[i].year + "</td>")
			.append("<td>" + results[i].make + "</td>")
			.append("<td>" + results[i].model + "</td>")
			.append("<td>" + results[i].mileage + "</td>")
			.append("<td>" + money.formatMoney(results[i].price) + "</td>")
			.append("<td>" + results[i].exterior + "</td>")
			.append("<td>" + results[i].interior + "</td>");
	}
	$('#dynamicTable').append($table);
	var app = server()
		.use(function (req, res) {
			var _url = url.parse(req.url).pathname;
			if (_url.indexOf('/tablesorter/') != -1) {
				handleStatic(_url, res);
				return;
			} else {
				res.end($.html());
			}
		});
	http.createServer(app).listen(3000);
}

// grab the vehicles from the DB
function getArrayOfDocs(callback) {
	db.collection('cars').find().toArray(function (err, docs) {
		if (!docs) {
			callback(err, null);
			return;
		}
		callback(null, docs);
		return;
	});
}


function loadData(data, callback) {
	$ = cheerio.load(data);

	//some of DOM manipulation to get the table to show up
	$table = $('<table id="myTable" class="tablesorter">');
	$table.append('<caption>Potential Vehicles</caption>')
	// thead
	.append('<thead>').children('thead')
		.append('<tr />').children('tr').append('<th>Year</th><th>Make</th><th>Model</th><th>Mileage</th><th>Price</th><th>Exterior</th><th>Interior</th>');

	//tbody
	$tbody = $table.append('<tbody />').children('tbody');


	//get all of the cars, then add row per car
	async.waterfall([getArrayOfDocs], addRows);
}

// this seriously does nothing. Don't remove it.
function startServer(err) {
	if (err) {
		console.log(err);
	}
}

// also, a silly wrapper. Don't feel like fixing.
function editHTML(err, data) {
	if (err) {
		return console.log(err);
	}

	loadData(data, startServer);
}


// kick off the whole damned thing by connecting to the DB
db.connect('mongodb://127.0.0.1:27017/test',
	function (err, base) {
		if (err) {
			callback(err);
		}
		console.log('DB Connected');
		db = base;

		// grab index.html. we'll just store it statically. soooo lazy at this point
		file = fs.readFile('index.html', 'utf8', editHTML);
	});

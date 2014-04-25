var processSite = require('node-car-scraper');
var S = require('string');
S.extendPrototype();
var bmwURL = 'http://www.zimbrickbmw.com/VehicleSearchResults?pageContext=VehicleSearch&search' + 
'=new&search=preowned&search=certified&bodyType=All&make=BMW&series=All&model=All&bodyStyle=Sedan+4+' +
'Dr.&trim=All&stockOrVIN=&minPrice=-2147483648&maxPrice=50000&minYear=2004&maxYear=2014&minMileage=-' +
'2147483648&maxMileage=2147483647&minMPG=-2147483648&maxMPG=2147483647';

var BMW = require('./lib/bmw');
BMW = new BMW();

var fs = require('fs');
var util = require('util');


processSite(bmwURL, bmwSite, bmwPage, bmwLink, bmwFinal);
processSite(BMW.url, BMW.site, BMW.page, BMW.links, BMW.end);

function bmwSite (err, $, cb) {
	var numVehicles = $('#inv_search_count_container').text();
	var numPages = Math.ceil(numVehicles / 10);
	var pages = [];
	pages[0] = bmwURL;
	for (var i = 2; i <= numPages; i++) {
		pages[i - 1] = bmwURL + '&pageNumber=' + i;
	}
	cb(pages);
}

function bmwPage (err, $, cb) {
	var links = [];
	var temp;
	$('.result_item_moreDetailsLink').each(function (i, elem) {
		temp = $(elem).html();
		links.push('http://www.zimbrickbmw.com/' + temp.between('href="', '" title').toString());
		temp = null;
	});
	cb(links);
}

function bmwLink (err, $, cb) {
	var pic = $('#media_placeholder').html();
	pic = pic.between('src="', '" alt').toString();

	var description = $('.description').text();
	description = description.stripTags().collapseWhitespace().chompLeft('Description').toString();
	var price = $('#priceValue').text();
	var specs = [];
	$('.specifications').children().each(function (i, elem) {
		var temp = $(this).html();
		var mykey = temp.between('<label>', ':</label').toString();
		var val = temp.between('<span>', '</span').toString();
		var ret = {};
		ret.name = mykey;
		ret.value = val;
		specs.push(ret);
		return;
	});
	var category = { name: 'category', value: $('.category', '#standardEquipment_content').text() };

	makeAndModel = [];
	$('span:not([class])', '#standardEquipment_content').each(function (i, elem) {
		var ret = {};
		switch (i) {
			case 0:
			ret.name = 'year';
			ret.value = $(this).text();
			break;
			case 1:
			ret.name = 'make';
			ret.value = $(this).text();
			break;
			case 2:
			ret.name = 'model';
			ret.value = $(this).text();
			break;
			case 3:
			ret.name = 'ignore';
			ret.value = $(this).text();
			break;
			default:
			return false;
		}
		makeAndModel.push(ret);
		return;
	});
	cb();
}

function bmwFinal () {
	console.log('HOLY SHIT');
}

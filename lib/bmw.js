var S = require('string');
var baseUrl = 'http://www.zimbrickbmw.com/VehicleSearchResults?pageContext=VehicleSearch&search' + 
'=new&search=preowned&search=certified&bodyType=All&make=BMW&series=All&model=All&bodyStyle=Sedan+4+' +
'Dr.&trim=All&stockOrVIN=&minPrice=-2147483648&maxPrice=50000&minYear=2004&maxYear=2014&minMileage=-' +
'2147483648&maxMileage=2147483647&minMPG=-2147483648&maxMPG=2147483647';
var addCallback;
var finalCB;

S.extendPrototype();

// constructor
// expects two callbacks or explicit nulls
// 1) A callback to be executed when a car object is ready to be added
// 2) A callback to be executed when all vehicles are finished processing
var BMW = function (addCB, finalCB) {
	this.url = baseUrl;
	this.addCB = addCB;
	this.finalCB = finalCB;
	addCallback = addCB;
	finalCallback = finalCB;
	return this;
};

// site callback
// when baseUrl is retrieved, this callback determines the number
// of search results and figures out how many and what pages they are
// spread across. returns the callback with the array of search pages
BMW.prototype.site = function(err, $, cb) {
	var numVehicles = $('#inv_search_count_container').text();
	var numPages = Math.ceil(numVehicles / 10);
	var pages = [];
	pages[0] = baseUrl;
	for (var i = 2; i <= numPages; i++) {
		pages[i - 1] = baseUrl + '&pageNumber=' + i;
	}
	return cb(pages);
};


// page callback
// for each page of search results, this cb is called.
// I'm parsing out the detail links for each car and passing those back
BMW.prototype.page = function(err, $, cb) {
	var links = [];
	var temp;

	$('.result_item_moreDetailsLink').each(function (i, elem) {
		temp = $(elem).html();
		links.push('http://www.zimbrickbmw.com/' + temp.between('href="', '" title').toString());
		temp = null;
	});
	return cb(links);
};

// link callback
// this is the meat and potatoes.
// for a single car, grab all of the relevant info 
// and call the addCallback with a car object as well as 'cb'
BMW.prototype.links = function(err, $, cb) {
	var car = {};
	car.pic = $('#media_placeholder').html();
	car.pic = car.pic.between('src="', '" alt').toString();

	car.description = $('.description').text();
	car.description = car.description.stripTags().collapseWhitespace().chompLeft('Description').toString();
	car.price = $('#priceValue').text().replaceAll('$', '').replaceAll(',', '').toString();
	$('.specifications').children().each(function (i, elem) {
		var temp = $(this).html();
		var mykey = temp.between('<label>', ':</label').toString();
		var val = temp.between('<span>', '</span').toString();
		car[mykey] = val;
		return;
	});
	car.category = $('.category', '#standardEquipment_content').text();

	$('span:not([class])', '#standardEquipment_content').each(function (i, elem) {
		switch (i) {
			case 0:
			car.year = $(this).text();
			break;
			case 1:
			car.make = $(this).text();
			break;
			case 2:
			car.model = $(this).text();
			break;
			default:
			return false;
		}
		return;
	});
	return addCallback(car,cb);
};


// final callback
// simply prints 'holy shit' to the console as if we're amazed we made it this far.
BMW.prototype.end = function() {
	console.log('Holy Shit!');
	return finalCallback();
};

exports = module.exports = BMW;
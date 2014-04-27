var S = require('string');
var baseUrl = 'http://www.zimbrickbmw.com/VehicleSearchResults?pageContext=VehicleSearch&search' + 
'=new&search=preowned&search=certified&bodyType=All&make=BMW&series=All&model=All&bodyStyle=Sedan+4+' +
'Dr.&trim=All&stockOrVIN=&minPrice=-2147483648&maxPrice=50000&minYear=2004&maxYear=2014&minMileage=-' +
'2147483648&maxMileage=2147483647&minMPG=-2147483648&maxMPG=2147483647';
var addCallback;

S.extendPrototype();

var BMW = function (addCB) {
	console.log(addCB);
	this.url = baseUrl;
	this.addCB = addCB;
	addCallback = addCB;
	console.log(addCallback);
	return this;
};

BMW.prototype.site = function(err, $, cb) {
	var numVehicles = $('#inv_search_count_container').text();
	var numPages = Math.ceil(numVehicles / 10);
	var pages = [];
	pages[0] = baseUrl;
	for (var i = 2; i <= numPages; i++) {
		pages[i - 1] = baseUrl + '&pageNumber=' + i;
	}
	cb(pages);
};

BMW.prototype.page = function(err, $, cb) {
	var links = [];
	var temp;

	$('.result_item_moreDetailsLink').each(function (i, elem) {
		temp = $(elem).html();
		links.push('http://www.zimbrickbmw.com/' + temp.between('href="', '" title').toString());
		temp = null;
	});
	cb(links);
};

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
	addCallback(car,cb);
	return;
};

BMW.prototype.end = function() {
	console.log('Holy Shit!');
};

exports = module.exports = BMW;
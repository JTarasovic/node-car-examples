var processSite = require('node-car-scraper');
var db = require('mongodb').MongoClient;
var today = new Date();

var add = function (obj, callback) {
    db.collection('cars').update({
            VIN: obj.VIN
        }, {
            $set: {
                VIN: obj.VIN,
                make: obj.make,
                model: obj.model,
                year: obj.year,
                price: obj.price,
                engine: obj.Engine,
                interior: obj.Interior,
                exterior: obj.Exterior,
                'model code': obj['Model Code'],
                'stock number': obj['Stock Number'],
                transmission: obj.Transmission,
                mileage: obj.Mileage,
                description: obj.description,
                picture: obj.pic,
                category: obj.category,
                update: today
            }
        }, {
            upsert: true,
            safe: true
        },
        function (err, result) {
            if (err) {
                callback(err);
            }
        });
    callback();
};


var BMW = require('./lib/bmw');
BMW = new BMW(add);


db.connect('mongodb://127.0.0.1:27017/test',
	function (err, base) {
		if (err) {
			callback(err);
		}
		console.log('DB Connected');
		db = base;
		processSite(BMW.url, BMW.site, BMW.page, BMW.links, BMW.end);
	});

process.on('SIGHUP', kill).on('SIGTERM', kill).on('uncaughtException', kill);

function kill (err) {
	if (err) {
		console.log(err);
		console.log(err.stack);
	}
	db.close();
	process.exit(1);
}

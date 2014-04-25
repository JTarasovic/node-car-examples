var processSite = require('node-car-scraper');
var BMW = require('./lib/bmw');
BMW = new BMW();





processSite(BMW.url, BMW.site, BMW.page, BMW.links, BMW.end);

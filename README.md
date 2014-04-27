node-car-examples
=================


Included are a few simple examples of using the [node-car-scraper](https://github.com/JTarasovic/node-car-scraper) wrapper.

### Installation
##### Install Node
Follow the instructions on the [Node](www.nodejs.org) website.
##### Clone this repo
`git clone https://www.github.com/JTarasovic/node-car-examples MyFolder`

##### Install Dependencies
`cd MyFolder && npm install`

### Running
##### Simple version
`node examples/simple.js`

This version just passes a site (reddit.com) to `node-car-scraper` which fetches the site and returns a [`cheerio`](https://github.com/cheeriojs/cheerio) object. 
```javascript
processSite('http://www.reddit.com', oneb, two, three, four);
function oneb (err, $, cb) {
	var arr = ['https://www.developer.mozilla.org', 'http://nodejs.org']; 
	return cb(arr);
}
```
The returned object is ignored and an array with two different sites are passed back to the callback. `node-car-scraper` gets both those pages and calls the link callback which parses all of the absolutely links off of the pages and sends it back to `node-car-scraper` which requests each of those links.
```javascript
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
```
The results of those requests are, again, ignored for simplicity; however, the callback is called.
```javascript
function three (err,$,cb) {
	return(cb());
}
```
After all of the links are processed, the final callback is called.
```javascript
function four () {
	console.log('HOLY SHIT!!');
}
```

##### Slightly better version
`node index.js`

This version uses a class that contains the necessary methods and properties to query a car dealership, get all of the search results and store them in MongoDB.
> See [index.js](index.js) and [bmw.js](lib/bmw.js) for more details.


### Viewing the results webpage
`node server.js`

This is very much a quick and dirty web server that returns the results in a nice table if you navigate to `localhost:3000`. I'd like to migrate this to Handlebars or something similar instead of fiddling with the HTML directly but it works for the short term.

### Adapting these examples
There are a couple of options:
##### Export a class that contains the necessary callback functions. 
See [bmw.js](lib/bmw.js) for more details on this method.
> This is probably the preferred method as you can create a separate class for each dealership/website that you would like to query.

```javascript
var processSite = require('node-car-scraper');
var Car = require('MyCarClass');
var car = new Car();

processSite(car.url, car.siteCallback, car.pageCallback, car.linkCallback, car.finalCallback);
```

##### Use anonymous functions.
```
var processSite = require('node-car-scraper');

processSite('http://www.example.com',
    function(err, $, callback){
        // ... send back an array of pages to visit based on the first URL visited
        callback(arr);
    },
    function(err, $, callback){
        // ... send back an array of links for individual pages to query
        callback(arr);
    },
    function(err, $, callback){
       // ... given one page with the necessary details, parse out what it relevent to you.
       // ... this is where you'd add an entry into a DB if desired
       // ... call the callback with no args
       callback();
    },
    function(){
       // ... final callback. Only called once when all of the links have been processed.
       console.log('WOOT! Finished!');
    });
```

##### Pass named functions as callbacks.
```
processSite(url, getPagesFromSite, getLinksFromPage, getDetailsFromIndividualPage, finished);

function getPagesFromSite (err, $, callback){
    // ... send back an array of pages to visit based on the first URL visited
    callback(arr);
}

function getLinksFromPage (err, $, callback){
    // ... send back an array of links for individual pages to query
    callback(arr);
},

function getDetailsFromIndividualPage (err, $, callback){
    // ... given one page with the necessary details, parse out what it relevent to you.
    // ... this is where you'd add an entry into a DB if desired
    // ... call the callback with no args
    callback();
},

function finished (){
    // ... final callback. Only called once when all of the links have been processed.
    console.log('WOOT! Finished!');
};
```

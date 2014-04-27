node-car-examples
=================


Included are a few simple examples of using the [node-car-scraper](https://github.com/JTarasovic/node-car-scraper) wrapper.

There are a couple of options:

Export a class that contains the necessary callback functions. See [bmw.js](lib/bmw.js) for more details on this method.

```
var processSite = require('node-car-scraper');
var Car = require('MyCarClass');
var car = new Car();

processSite(car.url, car.siteCallback, car.pageCallback, car.linkCallback, car.finalCallback);

```

Use anonymous functions.

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

Pass named functions as callbacks.

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

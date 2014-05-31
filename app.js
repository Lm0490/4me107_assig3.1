var http = require('http');

var express = require('express');
// initiation of app
var app = express();
var io = require('socket.io');
// for twitter
var util = require('util'),
    twitter = require('twitter');
// for eventful
var url = require('url');
var querystring = require('querystring');
var fs = require('fs'),
	xml2js = require('xml2js');
// eBay
var ebay = require('./ebayIndex.js');
// Hotel / Kayak
var simplexml=require('xml-simple');
var request = require('request');
var hotel_config= {host:'www.kayak.com', path:'/h/rss/hotelrss/SE/vaxjo?mc=EUR', port:80}, hotel_body='';
var arrhotel = []; //Array of the hotels

// parser 
var parser = new xml2js.Parser(); // parser eventful

// all environments + uberspace port (65535)
app.set('port', process.env.PORT || 5000);

// Code for the Mashup parts based on node-js the code for the different services

// Twitter 

app.get('/getTweets', function(req, res) {

	//	for avoiding crossbrowser-error
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Content-Type','application/json');


	getTweetByText('vaxjo OR #vaxjo',function(reply){
		console.log(JSON.stringify(reply));
		res.send(reply);
	});
});

var twit = new twitter({
    consumer_key: 'FAw9f1ueAkRHi0SiYPsX8UChy',
    consumer_secret: 't2t7CVoBxdWUi56fYb3Skoxz0PGm9NHg8wyBWSU23FlPdJdnLX',
    access_token_key: '1886948988-rJlWHGF5Zini6WC2iecDAPEFEvarF9s8EHltpO2',
    access_token_secret: '76TzwrCakZUCsR5KxwhKyWinUnJC9OulGkPXaxBV1N4UB'
});

var	count = 0,
	lastc = 0;

function tweet(data) {
	count++;
	if ( typeof data === 'string' )
		sys.puts(data);
	else if ( data.text && data.user && data.user.screen_name )
		sys.puts('"' + data.text + '" -- ' + data.user.screen_name);
	else if ( data.message )
		sys.puts('ERROR: ' + sys.inspect(data));
	else
		sys.puts(sys.inspect(data));
}

function memrep(callback) {
	var rep = process.memoryUsage();
	rep.tweets = count - lastc;
	lastc = count;
	callback(rep);
}

function getTweetByText(text,callback){
	twit.search(text, function(data) {
		callback(data);
	});	
}

// Eventful

app.get('/getEventful/:within', function (req, res) {
    console.log('inside getEventful');
    //	for avoiding crossbrowser-error
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.header('Content-type', 'application/json');
    res.header('Charset', 'utf8');
    // var params = querystring.parse(url.parse(req.url).query);
    var test = req.param("within");
    console.log(test);
    var ro = {};
    parser.addListener('end', function (result) {
        ro = JSON.stringify(result);
        //console.log(ro);
        res.send(req.query.callback + '(' + ro + ');');
    });

    var requestE = require('request');
    requestE('http://api.eventful.com/rest/events/rss?app_key=VvkjQ33nkQJnqW8P&location=vaxjo%20sweden&q=*&sort_order=date&within='+req.param("within"), function (error, response2, body) {
        if (!error && response2.statusCode == 200) {
            parser.parseString(body, function () {
                res.end();
            });
        }
    });
});

// eBay

app.get('/getEbay', function(req, res) {
    console.log('inside get');
    //	for avoiding crossbrowser-error
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Content-Type', 'application/json');

    getEbaybyResults(function(error, items) {
          if (error) throw error;

          console.log('Found', items.length, 'items');
          //  res.send(items);
          console.log(JSON.stringify(items));

        res.end(JSON.stringify(items));
    });
});

function getEbaybyResults(callback) {

   var params = {};

    params.keywords = ["Vaxjo", "V%C3%A4xj%C3%B6"];
    params['paginationInput.entriesPerPage'] = 5;
    ebay.ebayApiGetRequest(
      {
        serviceName: 'FindingService',
        opType: 'findItemsByKeywords',
        appId: 'NataliPo-aa20-4f7a-858a-d610efee7f9e',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
        params: params,
        // filters: filters,
        parser: ebay.parseItemsFromResponse    // (default)
      },
      function(error, items) {
        callback(error, items);
      }
    );
    //ebayApiGetRequest();
}

// Hotel
app.get("/getHotel/:min/:max", function (req, res) {

    //	for avoiding crossbrowser-error
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.header('Content-type', 'application/json');
    res.header('Charset', 'utf8');
   // arrhotel = [];
    console.log('test');
    var kayak = http.get(hotel_config, function (myhotel) {
        myhotel.addListener('end', function () {

            simplexml.parse(hotel_body, function (e, parsed) {
                arrhotel = [];
                parsed.channel.item.forEach(function (entry) {
                    arrhotel.push({ name: entry.title, externalLink: entry.link, price: entry['kyk:price'], stars: entry['kyk:stars'] });
                });
            });
            res.send(return_matches(req.params.min, req.params.max));
        });
        myhotel.setEncoding('utf8');
        myhotel.on('data', function (d) {
            hotel_body += d;
        });
    });
});

function return_matches( min ,  max ) { //return only kayak hotels within price range
	//arrhotel = [];
    var matches = [];
	for( var key in arrhotel) {
	  var obj = arrhotel[key];
	  if(parseFloat(obj['price']) < max && parseFloat(obj['price']) > min) {
	    matches.push(obj);
	  }
	  
	}
	//console.log("matches= \n" + matches);
	return matches; 
}



// very end of document - initiate server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

console.log('Listening on port 5000...');
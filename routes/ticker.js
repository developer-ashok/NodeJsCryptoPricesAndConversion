var express = require('express');
var router = express.Router();
var Curl = require( 'node-libcurl').Curl;
var Currencies = ["AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];
var SortingsData = [{"name":"Name"},{"rank":"Rank"},{"volume_24h":"Volume 24H"},{"percent_change_24h":"Percent Change 24h"},{"price":"Price"}]


/* GET crypto ticker data. */
router.get('/', function(req, res, next) {
  var defaultConvert = (req.query.c !== undefined && req.query.c !== null) ? req.query.c : "USD";
  var defaultSort = (req.query.s !== undefined && req.query.s !== null) ? req.query.s : "id";

  var tickerUrl = "https://api.coinmarketcap.com/v2/ticker?structure=array&convert="+defaultConvert+"&sort="+defaultSort;
  var tickerData = {};  

  var curl = new Curl();
  curl.setOpt( Curl.option.URL, tickerUrl );  
  curl.setOpt('FOLLOWLOCATION', true);
  curl.on('end', function( statusCode, body, headers ) {
      tickerData = JSON.parse(body); // JSON.parse is for getting data from the json from the server URL
      res.statusCode = 200;
      var result = tickerData.data;
      res.render('ticker', 
        { tickerData: result, 
          convert: defaultConvert,
          dsort: defaultSort,
          currencies: Currencies,
          sortings: SortingsData
        }
      );   
  });
  curl.on('error', curl.close.bind(curl));
  curl.perform();  
});


router.get('/get/(:cid)', function(req, res, next) {  
  var tickerID = (req.params.cid) ? req.params.cid : 1;
  var tickerUrl = "https://api.coinmarketcap.com/v2/ticker/"+req.params.cid;
  var tickerData = {};  

  var curl = new Curl();
  curl.setOpt( Curl.option.URL, tickerUrl );  
  curl.setOpt('FOLLOWLOCATION', true);
  curl.on('end', function( statusCode, body, headers ) {
      tickerData = JSON.parse(body); // JSON.parse is for getting data from the json from the server URL
      res.statusCode = 200;      
      res.render('oneticker', 
        { tickerData: tickerData.data}
      );   
  });
  curl.on('error', curl.close.bind(curl));
  curl.perform(); 
});  



module.exports = router;

var request = require('request')
var colors = require('colors')
var fs = require('fs')

var tickers;

fs.readFile('tickers.txt', 'utf8', function(err, data) {
  tickers = data.replace(/\r?\n/g, ',').replace(' ', '').toUpperCase();
  tickers.match(/,$/g) && (tickers = tickers.slice(0, tickers.length-1));

  updateTickers(tickers);
});

var updateTickers = function() {
  request('http://finance.google.com/finance/info?client=ig&q=NASDAQ%3a' + tickers, function(err, res, body) {
    body = body.slice(3, body.length);
    var json = JSON.parse(body);

    var output = '[' + new Date().toISOString().replace(/\..+/, '').split('T')[1] + '] ';
    for(var i = 0; i < json.length; i++) {
      var color = (json[i].c < 0) ? 'red' : 'green';
      output += json[i].t + ': $' + json[i].l + ' (' + json[i].c[color] + ')   ';
    }

    console.log('\033[2J' + output);

    setTimeout(updateTickers, 3000);
  });
}

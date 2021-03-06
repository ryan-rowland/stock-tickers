var request = require('request')
var colors = require('colors')
var fs = require('fs')

var url = 'http://finance.google.com/finance/info?client=ig&q=NASDAQ%3a';

// Concatenate tickers.conf into a comma-delimited string
fs.readFile('conf/tickers.conf', 'utf8', function(err, data) {
  url += data.replace(/\r?\n/g, ',').replace(/\s?\t/g, '').toUpperCase();

  updateTickers();
});

var updateTickers = function() {
  request(url, function(err, res, body) {
    // Convert response to JSON
    body = body.slice(3, body.length);
    var json = '';
    try {
      json = JSON.parse(body);
    } catch (e) {
      setTimeout(updateTickers, 3000);
      return;
    }

    // Format timestamp
    var output = '[' + new Date().toISOString().replace(/\..+/, '').split('T')[1] + '] ';
    for(var i = 0; i < json.length; i++) {
      // Format string with color-coded price change
      if(json[i].c[0] == '+') {
        json[i].c = ('▲ ' + json[i].c.slice(1, json[i].c.length)).green;
      } else {
        json[i].c = ('▼ ' + json[i].c.slice(1, json[i].c.length)).red;
      }
      output += json[i].t + ': $' + json[i].l + ' (' + json[i].c + ')   ';
    }

    // Clear the shell and print new output
    console.log('\033[2J' + output);

    // Do it again in 3 seconds
    setTimeout(updateTickers, 3000);
  });
}

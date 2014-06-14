var express = require('express');
var _ = require("underscore");
var app = express();
var calculator = require('./public/js/solarCalculations/sunCalculator')
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/api', function (req, res) {
  var area = req.query.area,
    state = req.query.state,
    residents = req.query.residents,
    kind = req.query.kind;

  var result = calculator().calculateSolarCap(area, state, residents, kind);

  res.json(result);
});

http.listen(8081);
console.log("App listening on port 8081");
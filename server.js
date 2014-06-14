var express  = require('express');
var _ = require("underscore");
var app      = express();
var http = require('http').Server(app);
var calcs = require('calcs');

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('*', function(req, res) {
	res.render('index.html');
});

http.listen(8000);
console.log("App listening on port 8000");
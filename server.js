var express  = require('express');
var _ = require("underscore");
var app      = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('*', function(req, res) {
	res.render('index.html');
});

http.listen(8081);
console.log("App listening on port 8000");
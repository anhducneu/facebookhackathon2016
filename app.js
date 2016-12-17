var express = require('express');
var morgan = require('morgan');

var app = express();
app.use(morgan('combined'))

var config = require('./config');
var vision = require('./controllers/vision');
// var customsearch = require('./controllers/customsearch');


app.use(vision);
// app.use('/tree/image', customsearch);

app.listen(config.port, function () {
    console.log('App listening on port ' + config.port);
});








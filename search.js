
var mongoose = require('mongoose');
var _ = require('lodash');


mongoose.connect('mongodb://localhost:27017/messages');

var Message = require('./messages');

Message.createMapping(function (err, mapping) {
    console.log('mapping created');
});


var geoFilter = {
	"geo_distance": {
		"distance": "300km", 
		"geo.coor": { 
			"lat":37.0535 ,
			"lon": -2.2625
		}
	}
};

Message.search({ from: 0, size: 20}, {filter: geoFilter, hydrate: true}, function(err, res) { 

_.forEach(res.hits.hits, function(msg) {
	console.log( msg.title, msg.superTitle);
});

console.log('Showing %s results of %s total', res.hits.hits.length, res.hits.total);
process.exit();
})

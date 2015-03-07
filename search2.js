
var mongoose = require('mongoose');
var _ = require('lodash');


mongoose.connect('mongodb://localhost:27017/messages');

var Message = require('./messages');

Message.createMapping(function (err, mapping) {
    console.log('mapping created');
});

var LAT = 37.417,
    LON = -3.1152,
    DISTANCE = 150;

var TITLE = 'generation';

var filters = {
        "bool": {
            "should": [
                {
                    "bool": {
                        "must": [
                        { "term": { "title": TITLE } },
                        { "range": { "year": { "gte": 2000} } }
                    ]
                    }
                },
                { 
                    "geo_distance": {
                        "distance": DISTANCE + "km", 
                        "geo.coor": { 
                            "lat": LAT,
                            "lon": LON
                        }
                    }
                }

            ]
        }
};

Message.search({ from:0, size: 30,  filter: filters}, {hydrate: true}, function(err, res) { 

_.forEach(res.hits.hits, function(msg) {
	console.log( msg.title, msg.superTitle, msg.year, msg.geo.coor );
});

console.log('Showing %s results of %s total', res.hits.hits.length, res.hits.total);
process.exit();
})

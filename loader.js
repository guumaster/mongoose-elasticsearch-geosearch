var faker = require('faker');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var coder = require('country-data').lookup;
var args = require('yargs').argv;

var TOTAL_MESSSAGES = args.messages || 10;
var EMPTY_COLLECTION = args.empty !== undefined;

mongoose.connect('mongodb://localhost:27017/messages');

var Message = require('./messages');

Message.createMapping(function (err, mapping) {
    console.log('mapping created');
});

var START_TIME = Date.now();
var LAST_LOOP = 0;
var START_LOOP = START_TIME;

var message_count = 0;
var total = 0;

var totalHomies = createHomiesIds(20);

async.series({
    empty: function(next) {

        if( !EMPTY_COLLECTION ) {
            return next();
        }
        console.log('Droping documents');
        Message.remove({}, next);
    },
    count: function (next) {
        Message.count({}, function (err, initial) {
            console.log('Starting from ', initial);
            total = initial;
            next();
        });
    },
    insert: function (next) {

        async.whilst(
            function () {
                return message_count < TOTAL_MESSSAGES;
            },
	    createMessage,
            function (err) {
                console.log('Total inserted: %d in %dms', TOTAL_MESSSAGES, Date.now() - START_TIME);
                next();
            }
        );

    }
}, function (err, res) {
    mongoose.connection.close();
    process.exit();
});



function createMessage(callback) {
    message_count++;
    if (message_count % 1000 === 0) {
        LAST_LOOP = Date.now() - START_LOOP;
        START_LOOP = Date.now();
        console.log('Inserted: %d in %dms', message_count, LAST_LOOP);
    }
    var countryCode = 'ES';
    var date = faker.date.past(50);
    var year = date.getFullYear();

    var message = {
        title: faker.company.catchPhrase(),
        text: faker.lorem.sentences(),
        countryCode: countryCode,
        homies: getRandomHomies(totalHomies, _.random(5)),
	geo: { coor: getLatLngObj() },
        scope: {
	    homies: !!_.random(0,1),
	    nbhd: !!_.random(0,1)
	},
        createdAt: date,
        year: year,
	stats: { comments: _.random(50) }
    };
    var message = Message.create(message, function (err, doc) {
        doc.on('es-indexed', function (err, res) {
            if (err) return callback(err);
            callback();
        });
    });
}

function getRandomHomies(homies, amount) { 
   return _.uniq(_.map(_.range(amount), function(x){
       return homies[_.random(homies.length-1)];
   }));
}

function createHomiesIds(amount) {
   return _.map(_.range(amount), function(){
	return new ObjectId();
   });
}

function getLatLng() {
	return [
	   -Number( _.random(1.2282, 6.1721).toFixed(4) ),
	  Number( _.random(37.6556, 42.5106).toFixed(4) ),
	];
}


function getLatLngObj() {
	return {
	   lon: -Number( _.random(1.2282, 6.1721).toFixed(4) ),
	   lat: Number( _.random(37.6556, 42.5106).toFixed(4) ),
	};
}

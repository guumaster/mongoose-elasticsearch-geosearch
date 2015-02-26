var mongoose = require("mongoose");
var async = require('async');
var yargs = require('yargs').argv;

var Messages = require('./messages');
var TRUNCATE= yargs.truncate !== undefined;

mongoose.connect('mongodb://localhost:27017/messages');

async.series({
   mapping: function(next){
  	 Messages.createMapping(function(err, mapping){
	   if(err) return next(err);
	   console.log('mapping created!');
	   next();
	});

   },
   truncate: function(next){
	if( !TRUNCATE) return next();

	Messages.esTruncate(function(err){
	    console.log( 'index truncated');
	    next();
	});
 },
   index: function(next){
	console.log( 'syncing');
	var stream = Messages.synchronize();
	var count = 0;
	 
	stream.on('data', function(err, doc){
	  count++;
	});

	stream.on('close', function(){
	  console.log('close.indexed ' + count + ' documents!');
          next();

	});
	stream.on('error', function(err){
	  console.log(err);
	});

   }

}, function(err, res){
    console.log( err, res );
    mongoose.connection.close();
    console.log( 'DONE!');
    process.exit();
});

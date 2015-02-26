var mongoose = require("mongoose");
var mongoosastic=require("mongoosastic");

var MessageSchema = new mongoose.Schema({
    title:  { type: String, es_indexed: true},
    text: { type:String, es_indexed:true },
    scope: {
        nbhd: {type: Boolean, es_indexed: true},
        homies: {type: Boolean, es_indexed: true}
    },
    homies: {
        type: Array,
        es_type: 'string',
        es_indexed: true,
        es_index: 'not_analyzed',
        es_index_name: 'homies'
    },
    rank: {
        type: Number,
        es_indexed: true,
        es_type: 'float'
    },
    countryCode: {
        type:String,
        es_indexed:true,
        es_index: 'not_analyzed',
        es_null_value: ''
    },
    geo: {
        coor: {
            geo_point: {
                type: String,
                es_indexed:true,
                es_type: 'geo_point',
                es_lat_lon: true
           }, 
           lat: Number,
           lon: Number
        },
    },
    stats: {
	comments: { type: Number, es_indexed: true }
    },
    year: {type: Number, es_indexed:true},
    createdAt: {type: Date, es_indexed:true, es_type: 'date'}
});

MessageSchema.plugin(mongoosastic,{
    host:"localhost",
    port: 9200,
    protocol: "http" /*,
    bulk: {
      size:1000,
      delay: 10000
    },
    curlDebug: true
    */
});

MessageSchema.virtual('superTitle').get(function(){
	return this.title.toUpperCase();
});

module.exports = mongoose.model("Message", MessageSchema);

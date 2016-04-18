var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var airlineAllSchema = new Schema(
{ _id:      {
                type: String,
                required: true
            },
airports:  {
            type: Array,
            required: true
        },


});

//airline schema
var airlineSchema   = new Schema(

{
    airport: {
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    },
    statistics: {
        flights: {
            cancelled: {
                        type: String,
                        },
            "on time": {
                        type: String
                        },
            total: {
                        type: String
                        },
            delayed: {
                        type: String
                    },
            diverted: {
                        type: String
                        }
        },
        "# of delays": {
            "late aircraft": {
                            type: String
                        },
            security: {
                            type: String
                        },
            weather: {
                            type: String
                        },
            "national aviation system": {
                            type: String
                        },
            carrier: {
                            type: String
                    }
        },
        "minutes delayed": {
            "late aircraft": {
                         type: String
                        },
            weather: {
                        type: String
                        },
            carrier: {
                        type: String
                        },
            security: {
                        type: String
                        },
            total: {
                            type: String
                        },
            "national aviation system": {
                            type: String
                        }
        }
    },
    time: {
        month: {
                        type: String
                },
        label: {
                        type: String
                },
        year: {
                        type: String
                }
    },
    carrier: {
        code: {
                        type: String
                },
        name: {
                        type: String
                }
    }
});

//module.exports = mongoose.model('Eq', eqSchema);
var airline = module.exports = mongoose.model('airline', airlineSchema);
//module.exports = eqSchema;
var airlineAll = module.exports = mongoose.model('airlineAll', airlineAllSchema);

module.exports.getNumberAirlines = function(callback, limit){
    console.log('here');
    airlineAll.find(callback).limit(new Number(limit));
};

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//eq schema
var eqSchema   = new Schema({
   
  type: {
            type: String,
            required: true
        },
   id: {
            type: String,
            
        },
__v: {
            type: String
        },
  properties: {
        mag: {
                type: Number,
                required: true
            },
        place: {
                type: String,
                required: true
            },
        time: {
                type: String,
                required: true
            },
        updated: {
                type: String
                
            },
        tz: {
                type: String
                
            },
        url: {
                type: String,
                required: true
            },
        felt:{
                type: String
            },
        cdi: {
                type: String
             },
        mmi: {
                type: String
             },
    alert: {
                type: String
             },
    status: {
                type: String
             },
    tsunami: {
                type: String,
             },
    sig:{
                type: String
             },
    net: {
                type: String
             },
    code: {
                type: String
             },
    ids: {
                type: String
             },
    sources: {
                type: String
             },
    types:{
                type: String
             },
    nst: {
                type: String
             },
    dmin: {
                type: String
             },
    rms: {
                type: String
             },
    gap: {
                type: String
             },
    magType: {
                type: String
             },
    type: {
                type: String
             },
    products: {
     String: [
        {
          id: {
                type: String
             },
          type: {
                type: String
             },
          code: {
                type: String
             },
          source: {
                type: String
             },
          updateTime: {
                type: String
             },
          status: {
                type: String
             },
          properties: {
            String: String
          },
          preferredWeight: {
                type: String
             },
          contents: {
            String: {
              contentType: {
                type: String
             },
              lastModified: {
                type: String
             },
              length:{
                type: String
             },
              url: {
                type: String
             },
            },
          }
        },

      ],

    }
  },
  geometry: {
    type: {
                type: String
             },
    coordinates: [
      Number,
      Number,
      Number
    ]
  },
  id: {
        type: String
    }


});

//module.exports = mongoose.model('Eq', eqSchema);
var eq = module.exports = mongoose.model('eq', eqSchema);
//module.exports = eqSchema;


module.exports.getNumberEq = function(callback, limit){
    console.log('here');
    eq.find(callback)
    .sort('-properties.time')
    .limit(new Number(limit));
};

module.exports.getMinMagnitude = function(callback, limit){
    console.log('Getting > magnitude...>' + limit);
    console.log();
    eq.find({"properties.mag": { $gt: limit }}, callback);//.toArray(callback);
    //eq.find(callback, {properties:{mag: { $gt: limit }}});//.toArray(callback);
     //  eq.find(callback).where('mag').gt(limit);   
    //eq.close();
};


module.exports.getMinMagNumberEq = function (callback, limitNumber, limitMag){
    console.log('Getting > magnitude > number...');
    eq.find({"properties.mag": { $gt: limitMag }}, callback)
    .sort('-properties.time')
    .limit(new Number(limitNumber));
        
    //eq.close();
};

module.exports.findExistingId = function (currEq, callback){
    console.log('Search for existing earthquake by > id...' + currEq.id);
    //eq.find({"properties.time" : currEq.properties.time}, callback);
    eq.find({"id" : currEq.id}, callback);
};

/*
*  Adjusting size of the database by elliminating the older earthquakes
* under the magnitude of 6.0
*/
module.exports.deleteExtra = function (max, callback){
    console.log('Adjusting size of databse to > max...' + max);
    //eq.find({"properties.time" : currEq.properties.time}, callback);
    eq.find({"properties.mag": { $gt: 6 }}, callback)
    sort('properties.time').forEach(function(currEq){
      console.log(curr.Eq);
    }, this);
};
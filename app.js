var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require ('lodash');
var request = require('request');
var CronJob = require('cron').CronJob; //updating database at certain intervals
/*
var option = {
  uri: 'https://www.googleapis.com/urlshortener/v1/url',
  method: 'POST',
  json: {
    "longUrl": "http://www.google.com/"
  }
};

request(option, function (error, response, body) {
  console.log(error);
  console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
    console.log(body.id) // Print the shortened url.
  }
});

*/



//usgs app
var app = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));

//CORS support -- open access to any server
//
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});


//inject models
app.models = require('./models/index');


//load the routes
var routes = require('./routes');
_.each(routes, function(controller, route){
	app.use(route, controller(app, route));
});

//latest number
app.get('/eq/latest/:number', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getNumberEq(function(err, eqk){
		if(err){
			throw err;
		}
		//console.log(eqk);
		res.json(eqk);
	}, req.params.number);
});


app.get('/eq/latest', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getNumberEq(function(err, eqk){
		if(err){
			throw err;
		}
		//console.log(eqk);
		res.json(eqk);
	});
});

app.get('/eq/magnitude/:number', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getMinMagnitude(function(err, eqk){
		if(err){
			throw err;
		}
		//console.log(eqk);
		res.json(eqk);
	}, req.params.number);
});

//search by magnitude limit

app.get('/eq/latest/:number1/magnitude/:number2', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getMinMagNumberEq(function(err, eqk){
		if(err){
			throw err;
		}
		//console.log(eqk);
		eqk = '{"Eqs":'+eqk+'}'; //client expects a field
		res.json(eqk);
	}, req.params.number1, req.params.number2);
});




var port = process.env.PORT || 8080;        // set our port
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'production'; //getting the environment from node


//connect to MongoDB
//add options as a last parameter to mongoose.connect to extend the life of connection and reduce errors (if needed)
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

//connect to database depending on the environment
if (env === 'production'){
	//connection for the production environment
	//mongoose.connect('mongodb://heroku_7fcjzxm4:i3np223uu9g4gsukb86dfmdbo5@ds031681.mlab.com:31681/heroku_7fcjzxm4'); //connect to our database
	mongoose.connect('mongodb://bridges:bridges@ds017678.mlab.com:17678/usgs'); //connect to our database
	//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); 
	
}
else{
	mongoose.connect('mongodb://localhost:27017/test');
}


//check the connection to database
var dbClient = mongoose.connection;
dbClient.on('error', function(err){
	//console.log.bind(console, 'connection error…');
	console.log(err);
	process.exit(1);

});
dbClient.once('open', function callback(){
	console.log('Listening on port 8080...');

}); 

//middleware

//var parser = require('JSONStream').parse('rows.*.doc');
//var eventStream = require('event-stream');

//var options = {db: 'mongodb://localhost:27017/test', collection: 'eqs'};
//var options = {db: 'mongodb://bridges:bridges@ds017678.mlab.com:17678/usgs', collection: 'eqs'};
/*var streamToMongo = require('stream-to-mongo')(options);
request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson')
	.pipe(parser)
	.pipe(streamToMongo);
*/
var job = new CronJob({
	cronTime: '*/60 * * * *',//'00 30 11 1-7', 
	onTick: function(){ //scheduling update every hour 
var str ='';
request.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson',
		function(error, response, body){
			
			if (!error && response.statusCode == 200){
				//console.log(JSON.parse(body).features);
			console.log("hello");
			};
}).on('data',function(incommingEq){
	str+=incommingEq
	
	if (str.length>1e6)
				request.connection.destroy();
			//console.log(str);
		
}).on('end', function(){
			 var newEq =  JSON.parse(str).features;
			//console.log(newEq);
			for (i=0; i<newEq.length; i++){
					if (dbClient.collection('eqs').find(newEq[i]))
					dbClient.collection('eqs').save(newEq[i], function(err, newdata){
						if(err) throw err;
					console.log('New eq data added...');
				});
			}
		});

	
}, 
function(){
	//other tasks once the db update is complete
},
start: true, //start now 
timeZone: ''//'America/Charlotte'
});

job.start();
//.pipe(parser)
//.pipe(eventStream.mapSync(function(data){
//	console.error(data);
//	return data;
//})));


//start the server
app.listen(port);
console.log('Magic happens on port ' + port);

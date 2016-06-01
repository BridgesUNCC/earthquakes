var express = require('express');
var relic = require ('newrelic');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require ('lodash');
var request = require('request');
var CronJob = require('cron').CronJob; //updating database at certain intervals
var PythonShell = require ('python-shell');

//usgs app
var app = express();
var exists=1,
	deleteNumber =1;
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
		
		res.json({"Earthquakes":eqk});

	}, req.params.number);
});


app.get('/eq/latest', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getNumberEq(function(err, eqk){
		if(err){
			throw err;
		}
		//console.log(eqk);
		//eqk = (('{"Eqs":').concat(eqk)).concat('}');
		res.json(eqk);
	});
});

app.get('/eq/magnitude/:number', function(req, res){
	//console.log(req.params.number);
	app.models.eq.getMinMagnitude(function(err, eqk){
		if(err){
			throw err;
		}
		
		//eqk = (('{"Eqs":').concat(eqk)).concat('}');
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
		res.json(eqk);//client expects a field
	}, req.params.number1, req.params.number2);
});

//get airline
app.get('/airline/:number', function(req, res){
	//console.log(req.params.number);
	app.models.airline.getNumberAirlines(function(err, air){
		if(err){
			throw err;
		}
		//console.log(eqk);
		//eqk = (('{"Eqs":').concat(eqk)).concat('}');
		res.json({"Airlines":air});
	}, req.params.number);
});

//get airline
app.get('/airlineAll', function(req, res){
	app.models.airlineAll.getNumberAirlines(function(err, air){
		if(err){
			throw err;
		}
		res.json(air);
	});
});

var port = process.env.PORT || 8080;        // set our port
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'production'; //getting the environment from node, change the production to anything to use the local database for testing


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

/*
* Cronjob adding new earthquakes every hour
*
*/
var job = new CronJob({
	cronTime: '*/1 * * * *',//'00 30 11 1-7', 
	onTick: function(){ //scheduling update every hour 
var str ='';
var client = request.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson',  //accessing the source of earthquakes
//this adds 600 eqs //request.get('http://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2016-04-23%2000:00:00&endtime=2016-05-23%2023:59:59&minmagnitude=1.5&orderby=time&limit=600',
//this adds all from beginning of year avove 2.5 request.get('http://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2016-01-01%2000:00:00&endtime=2016-05-23%2023:59:59&minmagnitude=4.5&eventtype=earthquake&orderby=time',
		function(error, response, body){
			
			if (!error && response.statusCode == 200){
			//console.log(JSON.parse(body).features);
			};
}).on('data',function(incommingEq){
	str+=incommingEq;								//concatenating new incomming eq
	
	if (str.length>1e6 && 'undefined' !== typeof x)	;							//if the string is too long the connection is interrupted
			client.destroy();
			//console.log(str);
		
}).on('end', function(){
			 var newEq =  JSON.parse(str).features;
			//console.log(newEq);
			newEq.forEach(function(currEq){    //search asynchronously 	
				//console.log(app.models.eq.findExistingId(newEq[i].id));
			    
			    app.models.eq.findExistingId(currEq, function(err, found){
						if(err){
								throw err;
						};
						exists = found.length;
						
						console.log("Found "+ exists);
						if (exists===0){
							console.log(currEq);
							dbClient.collection('eqs').save(currEq, function(err, newdata){
									if(err) throw err;
										console.log('New eq data added...');
							});
							deleteExtra(); //adjusting database size by deleting the oldest
						}
						else{
									console.log('No new data to add...');
									
							}
						
				});
			 	
			}, this); //this -- asynchronous

			//deleting the oldest and maintaining the size of the database
			var deleteExtra = function (){
			    app.models.eq.deleteExtra(deleteNumber, function(err, found){
						if(err){
								throw err;
						};
						
						app.models.eq.remove({"id" : found[0].id}, function(err){ //{"id" : found.id}
									if(err){ 
										throw err;
									}
									else
										console.log("Delete oldest " + found[0].id);					
						});
						
					});
				};
		});



	
}, 
		function(){
	//other tasks once the db update is complete
		},
		start: true, //start now 
		timeZone: ''//'America/Charlotte'
});



	job.start(); //starting the cron job


/*
*Cronjob keeping the server alive by sending a request every 10 minutes
*
*/
var keepAliveServ=new CronJob({
	cronTime: '*/10 * * * *',//'00 30 11 1-7', 
	onTick: function(){ //scheduling update every hour 
		request.get('https://earthquakes-uncc.herokuapp.com/eq/latest/1',
			function(error, response, body){
			
					if (!error && response.statusCode == 200){
						//console.log(JSON.parse(body).features);
					console.log("CronJob: Server alive.");
				};
		})

	}, 
	function(){
		//other tasks once the current job has stopped
	},
start: true, //start now 
timeZone: ''//'America/Charlotte'
});

keepAliveServ.start();


//start the server
app.listen(port);
console.log('Magic happens on port ' + port);

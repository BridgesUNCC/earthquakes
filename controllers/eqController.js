var restful = require('node-restful');

module.exports = function(app, route){
	var rest = restful.model('eq', app.models.eq).methods(['get', 'put', 'post', 'delete']);
												//.before('get', function(req, res, next){
														//req.body.limit =1;
														//next();
												//}) //add the methods
    //rest.register(app,route);
    //more routes realted to the eq model
	//rest.updateOptions({new: true});

	//rest.route('latest', function(req, res, next){
						//Earthquake.getNumberEq(function(err, eqs){
						//	if (err){
						//		throw err;
						//	}
						//	res.json(eqs);
					//});
						//console.log(rest.findOne());
						//res.send("Hello");
						//req.body.limit = 2;
						//res.locals.status_code =200;
						//res.locals.bundle.recommend = 'called';
						//res.writeHead(200, {'Content-Type': 'application/json'});
						//res.write(JSON.stringify({
						//	latest : 'called'
						//}));

						//res.end();
				//	}

		//);//.before('get');

	//endpoint
	rest.register(app, route);


	//return middleware
	return function(req, res, next){
		
		console.log("Middleware...");		
		return next();
	};
}
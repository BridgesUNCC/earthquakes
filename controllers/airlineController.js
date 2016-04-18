var restful = require('node-restful');

module.exports = function(app, route){
	var rest = restful.model('airline', app.models.airline).methods(['get', 'put', 'post', 'delete']);
												
	//endpoint
	rest.register(app, route);


	//return middleware
	return function(req, res, next){
		
		console.log("Middleware...");		
		return next();
	};
}
module.exports = function(req, res, next){
	//console.log(app.models.eq);

	//console.log(req.body.creator);
	//console.log(req.params);
	
	return function(req, res, next){
						console.log("Latest eq!");
						//console.log(req.params);
						next();
					};
};
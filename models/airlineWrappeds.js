var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//eq schema
var airlineWrappedSchema   = new Schema({
	'airline':{
		type: Schema.ObjectId,
		ref: 'airline'
		}
});

var airlineWpds = module.exports = mongoose.model('airlineWpds', airlineWrappedSchema);

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//eq schema
var eqWrappedSchema   = new Schema({
	'eq':{
		type: Schema.ObjectId,
		ref: 'eq'
		}
});

var eqWpds = module.exports = mongoose.model('eqWpds', eqWrappedSchema);

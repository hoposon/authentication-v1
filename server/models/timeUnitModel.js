const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TimeUnitSchema = new Schema({
	unitCode: {
		type: String,
		required: true
	},
	unitCodeName: {
		type: String,
		required: true
	}
})


const TimeUnit = mongoose.model('TimeUnit', TimeUnitSchema);
module.exports = {
	TimeUnit
};
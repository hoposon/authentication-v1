const mongoose = require('mongoose');
const { User } = require('./userModel');
const validator = require('validator');
const _ = require('lodash');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
	},
	description: {
		type: String,
        trim: true
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User' 
	}
})

// in methods, functions for Project instance are defined
// -----------------
// reduces parameters that shall be returned
ProjectSchema.methods.toJSON = function() { // !TODO why is this called automatically
	const project = this;
    const projectObject = project.toObject();

	return _.pick(projectObject, ['_id', 'name', 'description', '_user']);
}

const Project = mongoose.model('Project', ProjectSchema);
module.exports = {
	Project
};
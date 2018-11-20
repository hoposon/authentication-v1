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
        // validate: {
        //     // validator: (value) => {
        //     //     return validator.isEmail(value)
        //     // },
        //     validator: validator.isEmail,
        //     message: '{VALUE} is not a valid email'
        // }
	},
	description: {
		type: String,
        trim: true
	},
	_creator: {
		type: {
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
			email: {
				type: String,
				required: true
			},
			firstName: String,
			lastName: String
		},
		required: true,
		validate: async (v) => {
			const user = await User.findById(v._id);
			if (!user) return Promise.reject('User Not Found');
			return Promise.resolve('User found');
		}
	}
})

// in methods, functions for Project instance are defined
// -----------------
// reduces parameters that shall be returned
ProjectSchema.methods.toJSON = function() { // !TODO why is this called automatically
	const project = this;
    const projectObject = project.toObject();

    return _.pick(projectObject, ['_id', 'name']);
}

const Project = mongoose.model('Project', ProjectSchema);
module.exports = {Project};
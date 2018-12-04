const mongoose = require('mongoose');
const _ = require('lodash');
const { User } = require('./userModel');
const { Project } = require('./projectModel');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	comment: {
		type: String,
		trim: true,
		minlength: 1,
		maxlength: 5000
	},
	createDate: {
		type: Date,
		required: true
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true,
		validate: async (v) => {
			const user = await User.findById(v._id);
			if (!user) return Promise.reject('User Not Found');
			return Promise.resolve('User found');
		}
	},
	modified: [{
		_user: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User',
			required: true,
			validate: async (v) => {
				const user = await User.findById(v._id);
				if (!user) return Promise.reject('User Not Found');
				return Promise.resolve('User found');
			}
		},
		modifyDate: {
			type: Date,
			required: true
		}
	}]
})

const TicketSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	description: {
		type: String,
		maxlength: 5000,
		trim: true
	},
	createDate: {
		type: Date,
		required: true
	},
	comments: [CommentSchema],
	_state: {
		type: String,
		required: true
		// !TODO validation against State object
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true,
		validate: async (v) => {
			const user = await User.findById(v._id);
			if (!user) return Promise.reject('User Not Found');
			return Promise.resolve('User found');
		}
	},
	modified: [{
		_user: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User',
			required: true,
			validate: async (v) => {
				const user = await User.findById(v._id);
				if (!user) return Promise.reject('User Not Found');
				return Promise.resolve('User found');
			}
		},
		modifyDate: {
			type: Date,
			required: true
		}
	}],
	_project: {
		type: mongoose.Schema.Types.ObjectId, ref: 'Project',
		required: true,
		validate: async (v) => {
			const project = await Project.findById(v._id);
			if (!project) return Promise.reject('Project Not Found');
			return Promise.resolve('Project found');
		}
	}
})

// TicketSchema.pre('save', function(next) {
	
// })








const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = {
	Ticket
};
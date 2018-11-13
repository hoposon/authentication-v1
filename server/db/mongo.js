const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.CONNECTION_STRING);


module.exports = {
	mongoose
    // User: require('../users/user.model')
};
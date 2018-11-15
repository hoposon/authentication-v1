const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value)
            // },
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }], 
})

// mongoose middleware
// this is called before action specified in first argument (save)
// before user is saved
UserSchema.pre('save', function(next) {
    const user = this;

    // this checks if password parameter is going to be modified during the save
    // otherwise hashing funcion inside this block would hash hashed value
    // over and over again
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					// !TODO - log error and responde back res.send ....
				}
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// in methods, functions for User instance are defined
// -----------------
// reduces parameters that shall be returned to user
UserSchema.methods.toJSON = function() { // !TODO why is this called automatically
	const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// generates token and stores it to DB
UserSchema.methods.generateAuthToken = function() {
    var user = this;

    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    })
};

// in statics, functions for User definition are defined
// --------------------
// finds user by email and password
UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) {
                    reject();
                } else if (res) {
                    resolve(user);
                } else {
                    reject();
                }
                
            })
        })
    });
};


// finds user by token
UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;

    try{
		decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });

		// same as
        return Promise.reject(e);
    }
	console.log('token: ', token);
    return User.findOne({
        '_id': decoded._id, // doesn't have to have quotes around _id
        'tokens.token': token,
        'tokens.access':'auth'
    });
};


const User = mongoose.model('User', UserSchema);
module.exports = {User};
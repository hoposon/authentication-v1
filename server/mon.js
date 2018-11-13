const nav = require('./mon.1.js');
console.log('nav: ', nav);

// var mongoose = require('mongoose');

// mongoose.set('bufferCommands', false);
// mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

// var db = mongoose.connection;

// var kittySchema = new mongoose.Schema({
// 	name: String
// });

// kittySchema.methods.speak = function () {
// 	var greeting = this.name
// 		? "Meow name is " + this.name
// 		: "I don't have a name";
// 	console.log(greeting);
// }
// //console.log('schema: ', kittySchema);

// var Kitten = mongoose.model('Kitten', kittySchema);
// //console.log('model: ', Kitten);


// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// 	// we're connected!

// 	var silence = new Kitten({ name: 'Silence' });
// 	console.log(silence.name);

// 	var fluffy = new Kitten({ name: 'fluffy' });
// 	fluffy.speak();
	

// 	fluffy.save(function (err, fluffy) {
// 		if (err) return console.error(err);
// 		fluffy.speak();
// 	});
// 	console.log('fluffy: ', fluffy);

// 	Kitten.find(function (err, kittens) {
// 		if (err) return console.error(err);
// 		console.log(kittens);
// 	})

// 	Kitten.find({ name: /^fluff/ }, function (err, kittens) {
// 		if (err) return console.error(err);
// 		console.log(kittens);
// 	  });
// });
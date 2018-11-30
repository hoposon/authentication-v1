require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

// checks if the route is enabled
const {detectAllowedRoutes} = require('./middlewares/detectAllowedRoutes');

// set default route headers
const {setHeaders} = require('./middlewares/setHeaders');

// authentication middleware
const {authenticate} = require('./middlewares/authenticate');

// authorization middleware
const {authorize} = require('./middlewares/authorization');

// routes for user related services
const userRouter = require('./routes/userRouter');
const projectRouter = require('./routes/projectRouter');
const ticketRouter = require('./routes/ticketRouter');
const testRouter = require('./routes/testRouter');

// get mongoDB and create connection
require('./db/mongo');

// cors middleware require
const cors = require('cors');
const {getCorsConfig} = require('./routes/routes.config');

// create express app and set port
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
// 	res.header('Access-Control-Allow-Credentials', 'true');
// 	res.header('Access-Control-Allow-Headers', 'content-type');
// 	res.header('Access-Control-Allow-Origin', 'http://local.avast.com:5000');
// 	next();
// });
// app.options('/avast/test');
// // app.options('/avast/test', (req) => {
// // 	console.log('avast preflight request: ', req);
// // });
// app.post('/avast/test', (req, res) => {
// 	console.log('avast request: ', req.headers);
// 	res.send({message: "OK"});
// });

// middlewares --------------------
// parse middleware
app.use(bodyParser.json());
// sets headers
app.use(setHeaders);
// check if path is allowed
app.use(detectAllowedRoutes);
// set cors
app.use(cors(getCorsConfig));
// authenticate with jws
app.use(authenticate);
// authorization
app.use(authorize);
// middlewares --------------------

// routers --------------------
// user related routes
app.use('/v1/users', userRouter);

// project related routes
app.use('/v1/projects', projectRouter);

// ticket related routes
app.use('/v1/tickets', ticketRouter);


// test routes
app.use('/test', testRouter);
// routers --------------------


// !TODO checkout PATCH method

app.listen(port, () => {
	console.log(`Listening on port ${port}!!!`);
})
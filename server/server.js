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
const testRouter = require('./routes/testRouter');

// get mongoDB and create connection
require('./db/mongo');

// cors middleware require
const cors = require('cors');
const {getCorsConfig} = require('./routes/routes.config');

// create express app and set port
const app = express();
const port = process.env.PORT || 3000;

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

// user related routes
app.use('/v1/projects', projectRouter);

// test routes
app.use('/test', testRouter);
// routers --------------------


// !TODO checkout PATCH method

app.listen(port, () => {
	console.log(`Listening on port ${port}!!!`);
})
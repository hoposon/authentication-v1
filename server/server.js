require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

// checks if the route is enabled
const {detectAllowedRoutes} = require('./middlewares/detectAllowedRoutes');

// authentication middleware
const {authenticate} = require('./middlewares/authenticate');

// routes for user related services
const userRouter = require('./routes/userRouter');
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
// check if path is allowed
app.use(detectAllowedRoutes);
// authenticate with jws
app.use(authenticate);
// set cors
app.use(cors(getCorsConfig));
// middlewares --------------------

// routers --------------------
// user related routes
app.use('/v1/users', userRouter);

// test routes
app.use('/test', testRouter);
// routers --------------------


// !TODO checkout PATCH method

app.listen(port, () => {
	console.log(`Listening on port ${port}!!!`);
})
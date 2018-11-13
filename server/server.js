require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

// checks if the route is enabled
const {detectAllowedRoutes} = require('./middlewares/detectAllowedRoutes');

// routes for user related services
const userRouter = require('./routes/userRouter');
const testRouter = require('./routes/testRouter');

// get mongoDB and create connection
require('./db/mongo');

const cors = require('cors');
const {getCorsConfig} = require('./routes/routes.config');
// const jwt = require('./_helpers/jwt'); // !TODO - probably not neccessary


const app = express();
const port = 3000;

app.use(bodyParser.json());

// check if path is allowed
app.use(detectAllowedRoutes);

// set cors
app.use(cors(getCorsConfig));

// use JWT auth to secure the api
// app.use(jwt()); // !TODO - probably not neccessary


// user related routes
app.use('/v1/users', userRouter);

// user related routes
app.use('/test', testRouter);



// !TODO checkout PATCH method

app.listen(port, () => {
	console.log(`Listening on port ${port}!!!`);
})
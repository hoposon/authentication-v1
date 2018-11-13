const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    const config = require('./config.json'); // parses json to object automatically
    const envConfig = config[env];

	for (key in envConfig) {
		process.env[key] = envConfig[key];
	}
}

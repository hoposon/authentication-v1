const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
		{
			loader: 'babel-loader',
			test: /\.js$/,
			exclude: /node_modules/
		},
		// sass config
		/*{
			test: /\.s?css$/,
			use: [
				'style-loader',
				'css-loader',
				'sass-loader'
			]
		},*/
		// stylus config
		{
			test: /\.styl$/,
			use: [
			  {
				loader: "style-loader" // creates style nodes from JS strings
			  },
			  {
				loader: "css-loader" // translates CSS into CommonJS
			  },
			  {
				loader: "stylus-loader" // compiles Stylus to CSS
			  }
			]
      }
	]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};

var webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	entry: [
		'babel-polyfill',
		'./src/rosebud.js'
	],
	output: {
		path: '/dist/',
		filename: 'rosebud.js',
		publicPath: '/static/'
	},
	module: {
		loaders: [
			{ 
				test:  /\.js$|\.jsx$/, 
				exclude: /node_modules/, 
				loader: "babel-loader" 
			},
			{
				test: /\.json$/, loader: 'json'
			}, {
				test: /\.woff(2)?(\?.+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"
			}, {
				test: /\.ttf(\?.+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"
			}, {
				test: /\.eot(\?.+)?$/, loader: "file"
			}, {
				test: /\.svg(\?.+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"
			}, {
				test: /\.png$/, loader: "url-loader?limit=100000"
			}, {
				test: /\.jpg$/, loader: "file-loader"
			}, { 
				test: /\.css$/, loader: "style-loader!css-loader" 
			}
		]
	},
	resolve: {
		extensions: ["", ".json", ".js"],
	},
	devServer: {
		inline: true
	},
	plugins: [
		new webpack.ProvidePlugin({
			'THREE': 'three',
			'Stats': 'stats.js',
		})
	]
}

const Path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Webpack           = require('webpack');

module.exports.config = {
	mode: 'development',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test:/\.(ts|tsx)$/,
				use: [
					{loader: "awesome-typescript-loader"}
				]
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	},
	devtool: 'sourceMap',
	plugins: [
		new ExtractTextPlugin('index.css')
	]
}

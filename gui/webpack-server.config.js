const Base = require('./webpack-base.config.js');
const WebpackMerge = require('webpack-merge');
const Path = require('path');

module.exports = WebpackMerge(Base.config, {
	entry: './src/server/main.ts',
	target: 'node',
	output: {
		filename: 'server.js',
		path: Path.resolve('server')
	}
});

const Base = require('./webpack-base.config.js');
const WebpackMerge = require('webpack-merge');
const Path = require('path');

const nodeExternals = require('webpack-node-externals');

module.exports = WebpackMerge(Base.config, {
	entry: './src/server/main.ts',
	target: 'node',
	externals: [nodeExternals()],
	output: {
		filename: 'server.js',
		path: Path.resolve('server')
	}
});

const Base = require('./webpack-base.config.js');
const WebpackMerge = require('webpack-merge');
const Path = require('path');

module.exports = WebpackMerge(Base.config, {
	entry: './src/electron/main.ts',
	target: 'electron-main',
	output: {
		filename: 'main.js',
		path: Path.resolve('dist')
	}
});

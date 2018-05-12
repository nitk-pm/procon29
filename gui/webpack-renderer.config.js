const Base = require('./webpack-base.config.js');
const WebpackMerge = require('webpack-merge');
const Path = require('path');

module.exports = WebpackMerge(Base.config, {
	entry: './src/index.tsx',
	target: 'electron-renderer',
	output: {
		filename: 'renderer.js',
		path: Path.resolve('dist')
	}
});

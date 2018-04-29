module.exports = {
	mode: "development",
	entry: "./src/index.tsx",
	output: {
		filename: './bundle.js'
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test:/\.(ts|tsx)$/,
				use: [
					{loader: "awesome-typescript-loader"}
				]
			}
		]
	}
};

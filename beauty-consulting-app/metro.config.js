// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
	const config = getDefaultConfig(__dirname);
	const projectRoot = __dirname;
	const workspaceRoot = path.resolve(__dirname, "..");

	config.watchFolders = [workspaceRoot];

	const { transformer, resolver } = config;

	config.transformer = {
		...transformer,
		babelTransformerPath: require.resolve(
			"react-native-svg-transformer/expo"
		),
	};
	config.resolver = {
		...resolver,
		nodeModulesPaths: [
			path.resolve(projectRoot, "node_modules"),
			path.resolve(workspaceRoot, "node_modules"),
		],
		assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
		sourceExts: [...resolver.sourceExts, "svg"],
		extraNodeModules: {
			utils: path.resolve(__dirname, "app/utils"),
		},
	};

	return config;
})();

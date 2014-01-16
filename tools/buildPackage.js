var requirejs = require('requirejs');
var madge = require('madge');
var fs = require('fs');
var colors = require('colors');

/**
 * Converts all backslashes to slashes
 * @param str
 * @returns {*}
 */
function slash(str) {
	return str.replace(/\\/g, '/');
}

/**
 * Gathers a list of modules and one of dependencies
 * @param tree
 * @returns {{moduleList: Array, ignoreList: Array}}
 */
function getModulesAndDependencies(tree) {
	var moduleList = [];
	var ignoreList = [];

	for (var module in tree) {
		var dependencies = tree[module];

		moduleList.push(slash(module));

		dependencies.forEach(function(dependency) {
			if (dependency.substr(0, 4) === 'goo/') {
				if (ignoreList.indexOf(dependency) === -1) {
					ignoreList.push(dependency);
				}
			}
		});
	}

	return {
		moduleList: moduleList,
		ignoreList: ignoreList
	};
}

/**
 * Builds an empty module that requires every other module in the pack
 * @param moduleList
 * @param packName
 * @returns {string}
 */
function buildPack(moduleList, packName) {
	var lines = [];

	lines.push('require([');

	moduleList.forEach(function (moduleName) {
		if (packName !== moduleName) {
			lines.push('\t"' + packName + '/' + moduleName + '",');
		}
	});

	lines.push('], function () {');
	lines.push('});');

	var str = lines.join('\n');
	return str;
}

/**
 * Create the optimizer configuration
 * @param ignoreList
 * @returns {{baseUrl: string, out: string, name: string, paths: {}}}
 */
function getOptimizerConfig(ignoreList, outBaseDir) {
	var paths = {};

	ignoreList.forEach(function (ignoreItem) {
		paths[ignoreItem] = 'empty:';
	});

	var config = {
		baseUrl: 'src/',
		name: packName + '/' + packName,
		out: outBaseDir + '/' + packName + '.js',
		paths: paths
	};

	return config;
}

// get tha pack name
console.log('get tha pack name'.grey);
var packName = process.argv[2];

// out base dir
console.log('out base dir'.grey);
var outBaseDir = 'out';

// get all dependencies
console.log('get all dependencies'.grey);
var tree = madge('src/' + packName + '/', { format: 'amd' }).tree;

// get modules and dependencies
console.log('get modules and engine dependencies'.grey);
var modulesAndDependencies = getModulesAndDependencies(tree);

// get the source for the pack
console.log('get the source for the pack'.grey);
var packStr = buildPack(modulesAndDependencies.moduleList, packName);

// add the pack
console.log('add the pack');
fs.writeFile('src/' + packName + '/' + packName + '.js', packStr, function () {

	// get the config for the optimizer
	console.log('get the config for the optimizer'.grey);
	var optimizerConfig = getOptimizerConfig(modulesAndDependencies.ignoreList, outBaseDir);

	// optimize!
	console.log('optimize!');
	requirejs.optimize(optimizerConfig, function (buildResponse) {
		// buildResponse is just a text output of the modules included.

		console.log('Done'.green);

		console.log('Pack Name: '.grey, packName);

		console.log('Module List'.grey);
		console.log(modulesAndDependencies.moduleList);

		console.log('-----'.grey);
		console.log('Ignore List.grey');
		console.log(modulesAndDependencies.ignoreList);
	}, function(err) {
		// optimization err callback
		// :(
		console.error(err.red);
	});
});
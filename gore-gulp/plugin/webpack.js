/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var baseBabelConfig,
    path = require("path"),
    _ = require("lodash"),
    defaults = require(path.resolve(__dirname, "..", "defaults")),
    development = require(path.resolve(__dirname, "webpack", "development")),
    production = require(path.resolve(__dirname, "webpack", "production")),
    Promise = require("bluebird"),
    promisifiedGlob = Promise.promisify(require("glob")),
    querystring = require("querystring"),
    reactNative = require(path.resolve(__dirname, "webpack", "react-native")),
    webpack = require("webpack");

baseBabelConfig = {
    "loose": [
        "es6.modules",
        "es6.properties.computed",
        "es6.templateLiterals"
    ],
    "optional": [
        "es3.runtime",
        "minification.inlineExpressions",
        "runtime",
        "utility.deadCodeElimination",
        "utility.inlineEnvironmentVariables"
    ]
};

function normalizeAliasPaths(config, pckg) {
    var alias = {};

    alias[pckg.name] = path.resolve(config.baseDir, pckg.directories.lib);

    return _.merge(alias, pckg.alias);
}

function normalizeEntries(config, pckg, entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(config, pckg, entries[i], defaults.ecmaScriptFileExtensions)] = entries[i];
    }

    return ret;
}

function normalizeEntry(config, pckg, entry, fileExtensions) {
    var i,
        entryPointStem,
        fileExtension;

    for (i = 0; i < fileExtensions.length; i += 1) {
        fileExtension = ".entry" + fileExtensions[i];
        if (_.endsWith(entry, fileExtension)) {
            entryPointStem = path.relative(path.resolve(config.baseDir, pckg.directories.lib), entry);
            // replace all path.sep with spaces for more meaningful slugss
            entryPointStem = entryPointStem.split(path.sep).join(" ");
            entryPointStem = entryPointStem.substr(0, entryPointStem.length - fileExtension.length);

            return _.kebabCase(entryPointStem);
        }
    }

    return entry;
}

function normalizeProvidePaths(providePaths) {
    if (!providePaths) {
        return {};
    }

    return providePaths;
}

function run(config) {
    return new Promise(function (resolve, reject) {
        webpack(config, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function stub(config, pckgPromise) {

    return pckgPromise.then(function (pckg) {
            var libDir = path.resolve(config.baseDir, pckg.directories.lib);

            return promisifiedGlob(path.resolve(libDir, "**", "*.entry" + defaults.ecmaScriptFileExtensionsGlobPattern))
                .then(function (entries) {
                    return [
                        normalizeEntries(config, pckg, entries),
                        pckg,
                        libDir
                    ];
                });
        })
        .spread(function (entries, pckg, libDir) {
            return {
                "bail": true,
                "entry": entries,
                "externals": pckg.externals,
                "module": {
                    "loaders": [
                        {
                            // bower components usually expect to run in browser
                            // environment and sometimes assume that global 'this'
                            // is always the Window object which is a mistake
                            "test": /bower_components/,
                            "loader": require.resolve("imports-loader") + "?this=>window"
                        },
                        // {
                        //     "include": libDir,
                        //     "test": function (filename) {
                        //         return _.endsWith(filename, ".js");
                        //     },
                        //     "loader": require.resolve("babel-loader") + "?" + querystring.stringify(_.merge(baseBabelConfig, {
                        //         "blacklist": [
                        //             "react"
                        //         ]
                        //     }))
                        // },
                        {
                            "include": libDir,
                            "test": /\.jsx?$/,
                            // "test": function (filename) {
                            //     return _.endsWith(filename, ".jsx");
                            // },
                            "loader": require.resolve("babel-loader") + "?" + querystring.stringify(_.merge(baseBabelConfig, {
                                "optional": [
                                    "validation.react"
                                ]
                            }))
                        }
                    ]
                },
                "output": {
                    "filename": pckg.name + ".[name].min.js",
                    "path": path.resolve(config.baseDir, pckg.directories.dist)
                },
                "plugins": [
                    new webpack.ProvidePlugin(normalizeProvidePaths(pckg.provide)),
                    new webpack.optimize.CommonsChunkPlugin({
                        "filename": pckg.name + ".common.min.js"
                    })
                ],
                "resolve": {
                    "alias": normalizeAliasPaths(config, pckg),
                    "extensions": defaults.ecmaScriptFileExtensions,
                    "root": config.baseDir
                }
            };
        });
}

function setupVariant(variant) {
    return function (config, pckgPromise) {
        return function () {
            return stub(config, pckgPromise).then(variant).then(run);
        };
    };
}

module.exports = {
    "development": setupVariant(development),
    "production": setupVariant(production),
    "reactNative": setupVariant(reactNative)
};

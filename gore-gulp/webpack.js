/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    glob = require("glob"),
    Q = require("q"),
    querystring = require("querystring"),
    webpack = require("webpack");

function full(config) {
    return _.assign(config, {
        "debug": false,
        "plugins": [
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": "production"
                }
            }),
            new webpack.optimize.CommonsChunkPlugin(config.pckg.name + ".common.min.js"),
            new webpack.optimize.UglifyJsPlugin()
        ]
    });
}

function normalizeEntry(options, entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntryModuleName(entries[i], options.ecmaScriptFileExtensions)] = entries[i];
    }

    return ret;
}

function normalizeEntryModuleName(entry, fileExtensions) {
    var i,
        fileExtension;

    for (i = 0; i < fileExtensions.length; i += 1) {
        fileExtension = ".entry" + fileExtensions[i];
        if (_.endsWith(entry, fileExtension)) {
            return path.basename(entry, fileExtension);
        }
    }

    return entry;
}

function quick(config) {
    return _.assign(config, {
        "debug": true,
        "plugins": [
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": "development"
                }
            }),
            new webpack.optimize.CommonsChunkPlugin(config.pckg.name + ".common.min.js")
        ]
    });
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

function stub(options, baseDir) {
    var pckg = require(path.join(baseDir, "package.json"));

    return Q.nfcall(glob, path.join(__dirname, pckg.directories.lib, "**", "*.entry" + options.ecmaScriptFileExtensionsGlobPattern))
        .then(function (entries) {
            return normalizeEntry(options, entries);
        })
        .then(function (entries) {
            return {
                "bail": true,
                "context": path.join(__dirname, pckg.directories.lib),
                "devtool": "source-map",
                "entry": entries,
                "module": {
                    "loaders": [
                        {
                            // bower components usually expect to run in browser
                            // environment and sometimes assume that global 'this'
                            // is always the Window object which is a mistake
                            "test": /bower_components/,
                            "loader": "imports?this=>window"
                        },
                        {
                            "test": /\.jsx$/,
                            "exclude": /(bower_components|node_modules)/,
                            "loader": "babel-loader?" + querystring.stringify({
                                "loose": [
                                    "es6.modules",
                                    "es6.properties.computed",
                                    "es6.templateLiterals"
                                ],
                                "optional": [
                                    "runtime",
                                    "utility.deadCodeElimination",
                                    "utility.inlineExpressions",
                                    "validation.undeclaredVariableCheck",
                                    "validation.react"
                                ]
                            })
                        }
                    ]
                },
                "output": {
                    "filename": pckg.name + ".[name].min.js",
                    "path": path.join(baseDir, pckg.directories.dist)
                },
                "pckg": pckg,
                "resolve": {
                    "extensions": options.ecmaScriptFileExtensions
                }
            };
        });
}

function init(options, baseDir, variant) {
    return stub(options, baseDir).then(variant).then(run);
}

module.exports = {
    "full": function (options, baseDir) {
        return function () {
            return init(options, baseDir, full)
        };
    },
    "quick": function (options, baseDir) {
        return function () {
            return init(options, baseDir, quick);
        };
    }
};

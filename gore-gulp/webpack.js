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
    defaults = require(path.join(__dirname, "/defaults")),
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

function normalizeEntries(entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(entries[i], defaults.ecmaScriptFileExtensions)] = entries[i];
    }

    return ret;
}

function normalizeEntry(entry, fileExtensions) {
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
    return new Q.Promise(function (resolve, reject) {
        webpack(config, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function stub(baseDir, pckgPromise) {
    return pckgPromise.then(function (pckg) {
            return Q.nfcall(glob, path.join(__dirname, pckg.directories.lib, "**", "*.entry" + defaults.ecmaScriptFileExtensionsGlobPattern))
                .then(function (entries) {
                    return [
                        normalizeEntries(entries),
                        pckg
                    ];
                });
        })
        .spread(function (entries, pckg) {
            return {
                "bail": true,
                "context": pckg.directories.lib,
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
                                    "es3.runtime",
                                    "runtime",
                                    "utility.deadCodeElimination",
                                    "utility.inlineEnvironmentVariables",
                                    "utility.inlineExpressions",
                                    "validation.react",
                                    "validation.undeclaredVariableCheck"
                                ]
                            })
                        }
                    ]
                },
                "output": {
                    "filename": pckg.name + ".[name].min.js",
                    "path": pckg.directories.dist
                },
                "pckg": pckg,
                "resolve": {
                    "extensions": defaults.ecmaScriptFileExtensions
                },
                "resolveLoader": {
                    "root": path.join(__dirname, "..", "node_modules")
                }
            };
        });
}

module.exports = {
    "full": function (baseDir, pckgPromise) {
        return function () {
            return stub(baseDir, pckgPromise).then(full).then(run);
        };
    },
    "quick": function (baseDir, pckgPromise) {
        return function () {
            return stub(baseDir, pckgPromise).then(quick).then(run);
        };
    }
};

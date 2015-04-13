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
    defaults = require(path.join(__dirname, "defaults")),
    development = require(path.join(__dirname, "webpack", "development")),
    glob = require("glob"),
    production = require(path.join(__dirname, "webpack", "production")),
    Q = require("q"),
    querystring = require("querystring"),
    reactNative = require(path.join(__dirname, "webpack", "react-native")),
    slug = require("slug"),
    webpack = require("webpack");

function normalizeAliasPaths(baseDir, pckg) {
    var alias = {};

    alias[pckg.name] = path.resolve(baseDir, pckg.directories.lib);

    return _.merge(alias, pckg.alias);
}

function normalizeEntries(baseDir, pckg, entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(baseDir, pckg, entries[i], defaults.ecmaScriptFileExtensions)] = entries[i];
    }

    return ret;
}

function normalizeEntry(baseDir, pckg, entry, fileExtensions) {
    var i,
        entryPointStem,
        fileExtension;

    for (i = 0; i < fileExtensions.length; i += 1) {
        fileExtension = ".entry" + fileExtensions[i];
        if (_.endsWith(entry, fileExtension)) {
            entryPointStem = path.relative(path.join(baseDir, pckg.directories.lib), entry);
            // replace all path.sep with spaces for more meaningful slugss
            entryPointStem = entryPointStem.split(path.sep).join(" ");
            entryPointStem = entryPointStem.substr(0, entryPointStem.length - fileExtension.length);

            return slug(entryPointStem);
        }
    }

    return entry;
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
            return Q.nfcall(glob, path.resolve(baseDir, pckg.directories.lib, "**", "*.entry" + defaults.ecmaScriptFileExtensionsGlobPattern))
                .then(function (entries) {
                    return [
                        normalizeEntries(baseDir, pckg, entries),
                        pckg
                    ];
                });
        })
        .spread(function (entries, pckg) {
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
                        {
                            "test": /\.jsx$/,
                            "exclude": /(bower_components|node_modules)/,
                            "loader": require.resolve("babel-loader") + "?" + querystring.stringify({
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
                                    "validation.react"
                                ]
                            })
                        }
                    ]
                },
                "output": {
                    "filename": pckg.name + ".[name].min.js",
                    "path": path.resolve(baseDir, pckg.directories.dist)
                },
                "pckg": pckg,
                "resolve": {
                    "alias": normalizeAliasPaths(baseDir, pckg),
                    "extensions": defaults.ecmaScriptFileExtensions,
                    "root": baseDir
                }
            };
        });
}

function setupVariant(variant) {
    return function (baseDir, pckgPromise) {
        return function () {
            return stub(baseDir, pckgPromise).then(variant).then(run);
        };
    };
}

module.exports = {
    "development": setupVariant(development),
    "production": setupVariant(production),
    "reactNative": setupVariant(reactNative)
};

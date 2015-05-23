/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash"),
    path = require("path"),
    detectLibDir = require(path.resolve(__dirname, "..", "..", "pckg", "libDir")),
    ecmaScriptFileExtensions = require(path.resolve(__dirname, "..", "..", "pckg", "ecmaScriptFileExtensions")),
    querystring = require("querystring");

function babel(webpackConfig, config, pckg) {
    var libDir = detectLibDir(pckg, config);

    return _.merge(webpackConfig, {
        "bail": true,
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
                    "include": libDir,
                    "test": /\.jsx?$/,
                    "loader": require.resolve("babel-loader") + "?" + querystring.stringify({
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
                            "utility.inlineEnvironmentVariables",
                            "validation.react"
                        ]
                    })
                }
            ]
        },
        "resolve": {
            "alias": normalizeAliasPaths(webpackConfig, config, pckg, libDir),
            "extensions": ecmaScriptFileExtensions(pckg),
            "root": config.baseDir
        }
    });
}

function normalizeAliasPaths(webpackConfig, config, pckg, libDir) {
    var alias = {};

    alias[pckg.name] = libDir;

    return _.merge(alias, pckg.alias);
}

module.exports = babel;

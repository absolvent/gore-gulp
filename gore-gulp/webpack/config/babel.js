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
    baseBabelConfig,
    ecmaScriptFileExtensions = require(path.resolve(__dirname, "..", "..", "pckg", "ecmaScriptFileExtensions")),
    querystring = require("querystring");

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

function babel(config, pckg, libDir) {
    return _.merge(config, {
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
                    "loader": require.resolve("babel-loader") + "?" + querystring.stringify(_.merge(baseBabelConfig, {
                        "optional": [
                            "validation.react"
                        ]
                    }))
                }
            ]
        },
        "resolve": {
            "alias": normalizeAliasPaths(config, pckg),
            "extensions": ecmaScriptFileExtensions(pckg),
            "root": config.baseDir
        }
    });
}

function normalizeAliasPaths(config, pckg) {
    var alias = {};

    alias[pckg.name] = path.resolve(config.baseDir, pckg.directories.lib);

    return _.merge(alias, pckg.alias);
}

module.exports = babel;

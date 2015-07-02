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
    ecmaScriptFileExtensions = require(path.resolve(__dirname, "..", "..", "pckg", "ecmaScriptFileExtensions")),
    findPackage = require(path.resolve(__dirname, "..", "..", "findPackage")),
    libDirs = require(path.resolve(__dirname, "..", "..", "pckg", "libDirs")),
    Promise = require("bluebird");

function babel(webpackConfig, config, pckg) {
    return Promise.props({
        "babel-loader": findPackage(config, "babel-loader"),
        "imports-loader": findPackage(config, "imports-loader")
    }).then(function (results) {
        return _.merge(webpackConfig, {
            "bail": true,
            "externals": pckg.externals,
            "module": {
                "loaders": [
                    {
                        "include": _.map(libDirs(pckg), function (libDir) {
                            return path.resolve(config.baseDir, libDir);
                        }),
                        "test": /\.jsx?$/,
                        "loader": results["babel-loader"],
                        "query": {
                            "loose": [
                                "es6.modules",
                                "es6.properties.computed",
                                "es6.templateLiterals"
                            ],
                            "optional": [
                                "utility.inlineEnvironmentVariables",
                                "validation.react"
                            ]
                        }
                    }
                ]
            },
            "resolve": {
                "alias": normalizeAliasPaths(webpackConfig, config, pckg),
                "extensions": ecmaScriptFileExtensions(pckg),
                "root": config.baseDir
            }
        });
    });
}

function normalizeAliasPaths(webpackConfig, config, pckg) {
    var alias = {};

    if (!_.isArray(pckg.directories.lib)) {
        alias[pckg.name] = pckg.directories.lib;
    }

    return _.merge(alias, pckg.alias);
}

module.exports = babel;

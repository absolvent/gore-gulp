/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var ecmaScriptFileExtensions = require("../../../pckg/ecmaScriptFileExtensions"),
    findPackage = require("../../../findPackage"),
    isArray = require("lodash/isArray"),
    libDirs = require("../../../pckg/libDirs"),
    map = require("lodash/map"),
    merge = require("lodash/merge"),
    path = require("path"),
    Promise = require("bluebird");

function babel(webpackConfig, config, pckg, babelOverride) {
    return Promise.props({
        "babel-loader": findPackage(config, "babel-loader"),
        "imports-loader": findPackage(config, "imports-loader")
    }).then(function (results) {
        return merge({}, webpackConfig, {
            "bail": true,
            "externals": pckg.externals,
            "module": {
                "loaders": [
                    {
                        "include": map(libDirs(pckg), function (libDir) {
                            return path.resolve(config.baseDir, libDir);
                        }),
                        "test": /\.jsx?$/,
                        "loader": results["babel-loader"],
                        "query": merge({
                            "plugins": [
                                require.resolve("babel-plugin-syntax-jsx")
                            ],
                            "presets": [
                                require.resolve("babel-preset-es2015"),
                                require.resolve("babel-preset-react")
                            ]
                        }, babelOverride)
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

    if (!isArray(pckg.directories.lib)) {
        alias[pckg.name] = pckg.directories.lib;
    }

    return merge(alias, pckg.alias);
}

module.exports = babel;

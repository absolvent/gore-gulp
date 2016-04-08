/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const ecmaScriptFileExtensions = require("../../../pckg/ecmaScriptFileExtensions");
const findPackage = require("../../../findPackage");
const isArray = require("lodash/isArray");
const libDirs = require("../../../pckg/libDirs");
const map = require("lodash/map");
const merge = require("lodash/merge");
const path = require("path");
const Promise = require("bluebird");

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
                                require.resolve("babel-preset-react"),
                                require.resolve("babel-preset-stage-0")
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
    const alias = {};

    if (!isArray(pckg.directories.lib)) {
        alias[pckg.name] = pckg.directories.lib;
    }

    return merge(alias, pckg.alias);
}

module.exports = babel;

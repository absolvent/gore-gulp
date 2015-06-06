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
    babel = require(path.resolve(__dirname, "babel")),
    webpack = require("webpack");

function web(webpackConfig, config, pckg, entries) {
    return babel(webpackConfig, config, pckg)
        .then(function (babelConfig) {
            return _.merge(babelConfig, {
                "entry": entries,
                "output": {
                    "filename": pckg.name + ".[name].min.js",
                    "path": path.resolve(config.baseDir, pckg.directories.dist)
                },
                "plugins": [
                    new webpack.ProvidePlugin(normalizeProvidePaths(pckg.provide)),
                    new webpack.optimize.CommonsChunkPlugin({
                        "filename": pckg.name + ".common.min.js"
                    })
                ]
            });
        });
}

function normalizeProvidePaths(providePaths) {
    if (!providePaths) {
        return {};
    }

    return providePaths;
}

module.exports = web;

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    preprocessorPath = path.resolve(__dirname, "preprocessor.js"),
    preprocessors = [],
    webpack = require("webpack");

preprocessors[preprocessorPath] = [
    "sourcemap",
    "webpack"
];

module.exports = function (config) {
    config.set({
        "files": [
            preprocessorPath
        ],
        "frameworks": [
            "mocha"
        ],
        "preprocessors": preprocessors,
        "reporters": [
            "dots"
        ],
        "singleRun": true,
        "webpack": {
            "devtool": "inline-source-map",
            "module": {
                "loaders": [
                    {
                        "loader": "babel-loader",
                        "test": /\.js$/
                    }
                ]
            }
        },
        "webpackServer": {
            "noInfo": true
        }
    });
};

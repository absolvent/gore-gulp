/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash"),
    webpack = require("webpack");

function production(config) {
    return _.assign(config, {
        "debug": false,
        "devtool": "source-map",
        "plugins": [
            new webpack.optimize.CommonsChunkPlugin(config.pckg.name + ".common.min.js"),
            new webpack.optimize.UglifyJsPlugin()
        ]
    });
}

module.exports = production;

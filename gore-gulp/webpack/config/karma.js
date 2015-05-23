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
    babel = require(path.resolve(__dirname, "babel"));

function karma(webpackConfig, config, pckg) {
    return _.merge(babel(webpackConfig, config, pckg), {
        "devtool": "inline-source-map"
    });
}

module.exports = karma;

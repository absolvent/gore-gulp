/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var merge = require("lodash/object/merge"),
    web = require("./web"),
    webpack = require("webpack");

function production(webpackConfig, config, pckg, entries) {
    return web(webpackConfig, config, pckg, entries, {
        // "optional": [
        //     "optimisation.react.constantElements",
        //     "optimisation.react.inlineElements"
        // ]
    }).then(function (webConfig) {
        return merge({}, webConfig, {
            "debug": false,
            "devtool": "source-map",
            "plugins": [
                new webpack.optimize.UglifyJsPlugin()
            ]
        });
    });
}

module.exports = production;

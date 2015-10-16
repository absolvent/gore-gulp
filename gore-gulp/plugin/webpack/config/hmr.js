/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var merge = require("lodash/object/merge"),
    pckgPublicPath = require("../../../pckg/publicPath"),
    web = require("./web"),
    webpack = require("webpack");

function hmr(webpackConfig, config, pckg, entries) {
    return web(webpackConfig, config, pckg, entries).then(function (webConfig) {
        return merge(webConfig, {
            "devtool": "eval",
            "output": {
                "filename": "bundle.js",
                "publicPath": pckgPublicPath(pckg)
            },
            "plugins": [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin()
            ]
        });
    });
}

module.exports = hmr;

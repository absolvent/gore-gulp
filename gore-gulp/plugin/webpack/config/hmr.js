/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var mapValues = require("lodash/mapValues"),
    merge = require("lodash/merge"),
    pckgPublicPath = require("../../../pckg/publicPath"),
    web = require("./web"),
    webpack = require("webpack");

function hmr(webpackConfig, config, pckg, entries) {
    return web(webpackConfig, config, pckg, entries).then(function (webConfig) {
        var hmrConfig = merge({}, webConfig, {
            "devtool": "eval",
            "output": {
                "publicPath": pckgPublicPath(pckg)
            },
            "plugins": [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin()
            ]
        });

        hmrConfig.entry = normalizeEntriesForHmr(hmrConfig.entry);

        return hmrConfig;
    });
}

function normalizeEntriesForHmr(entries) {
    return mapValues(entries, function (entry) {
        return [
            "webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr"
        ].concat(entry);
    });
}

module.exports = hmr;

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var merge = require("lodash/object/merge"),
    web = require("./web");

function development(webpackConfig, config, pckg, entries) {
    return web(webpackConfig, config, pckg, entries, {}).then(function (webConfig) {
        return merge(webConfig, {
            "debug": true,
            "devtool": "cheap-source-map"
        });
    });
}

module.exports = development;

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const merge = require("lodash/merge");
const web = require("../web");

function development(config, pckg, entries) {
    return web(config, pckg, entries).then(function (webConfig) {
        return merge({}, webConfig, {
            "debug": true,
            "devtool": config.developmentDevtool || "none"
        });
    });
}

module.exports = development;

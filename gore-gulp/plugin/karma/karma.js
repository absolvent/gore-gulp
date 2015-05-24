/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    server = require(path.resolve(__dirname, "server"));

module.exports = function (config, pckgPromise, gulp) {
    var configuredServer = server(config, pckgPromise, gulp);

    return function () {
        return configuredServer();
    };
};

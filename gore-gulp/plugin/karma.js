/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    runner = require(path.resolve(__dirname, "karma", "runner")),
    server = require(path.resolve(__dirname, "karma", "server"));

module.exports = {
    "runner": runner,
    "server": server
};

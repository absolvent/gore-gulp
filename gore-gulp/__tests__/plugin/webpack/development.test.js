/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false */

var common = require("./common"),
    config = require("../../config");

describe("webpack/development", function () {
    this.timeout(config.timeout);
    common.setup("webpack.development");
});

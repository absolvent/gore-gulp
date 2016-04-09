/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false, it: false */

const config = require("./config");
const common = require("./plugin/webpack/common");
const path = require("path");

describe("example", function () {
    this.timeout(config.timeout);

    it("tests example basic package", function () {
        return common.runDirectory(path.resolve(__dirname, "..", "..", "example", "basic"), "webpack.production")
            .then(common.expectFiles([
                "example.common.min.js",
                "example.a.min.js",
                "example.b.min.js"
            ]));
    });
});

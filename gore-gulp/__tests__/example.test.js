/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false, it: false */

var path = require("path"),
    common = require(path.resolve(__dirname, "plugin", "webpack", "common"));

describe("example", function () {
    it("tests example basic package", function (done) {
        common.runDirectory(path.resolve(__dirname, "..", "..", "example", "basic"), "webpack.production")
            .then(common.expectFiles([
                "example.common.min.js",
                "example.common.min.js.map",
                "example.a.min.js",
                "example.a.min.js.map",
                "example.b.min.js",
                "example.b.min.js.map"
            ]))
            .nodeify(done);
    });
});

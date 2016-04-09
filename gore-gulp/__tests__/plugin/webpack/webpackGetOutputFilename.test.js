/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false, it: false */

const assert = require("chai").assert;
const webpackGetOutputFilename = require("../../../plugin/webpack/webpackGetOutputFilename");

describe("webpack/webpackGetOutputFilename", function () {
    it("normalizes filename", function () {
        const outputFilename = webpackGetOutputFilename({
            "output": {
                "filename": "foo.[name].min.js"
            }
        }, "bar");

        assert.strictEqual(outputFilename, "foo.bar.min.js");
    });
});

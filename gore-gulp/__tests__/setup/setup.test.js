/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global afterEach:false, beforeEach: false, describe: false, it: false */

var path = require("path"),
    assert = require("chai").assert,
    gg = require(path.join(__dirname, "..", ".."));

describe("setup", function () {
    var previousNodeEnv;

    function doTestSetup(environment, taskName) {
        var tasks = {};

        process.env.NODE_ENV = environment;

        gg(path.join(__dirname, "..", "..", "__fixtures__", "test-library-1")).setup({
            "task": function (name, deps) {
                tasks[name] = deps;
            }
        });

        assert.deepEqual(tasks.webpack, [
            taskName
        ]);
    }

    afterEach(function () {
        process.env.NODE_ENV = previousNodeEnv;
    });

    beforeEach(function () {
        previousNodeEnv = process.env.NODE_ENV;
    });

    it("sets up gulp instance using development settings", function () {
        doTestSetup("development", "webpack.development");
    });

    it("sets up gulp instance using production settings", function () {
        doTestSetup("production", "webpack.production");
    });
});

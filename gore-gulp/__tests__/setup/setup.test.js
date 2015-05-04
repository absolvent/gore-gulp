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
    gg = require(path.join(__dirname, "..", "..")),
    Gulp = require("gulp").Gulp;

describe("setup", function () {
    var previousNodeEnv;

    function doTestSetup(done, environment, taskName) {
        var gulpInstance = new Gulp();

        process.env.NODE_ENV = environment;

        gg(path.join(__dirname, "..", "..", "__fixtures__", "test-library-1")).setup(gulpInstance);

        gulpInstance.task(taskName, function () {
            done();
        });
        gulpInstance.start("webpack");
    }

    afterEach(function () {
        process.env.NODE_ENV = previousNodeEnv;
    });

    beforeEach(function () {
        previousNodeEnv = process.env.NODE_ENV;
    });

    it("sets up gulp instance using development settings", function (done) {
        doTestSetup(done, "development", "webpack.development");
    });

    it("sets up gulp instance using production settings", function (done) {
        doTestSetup(done, "production", "webpack.production");
    });
});

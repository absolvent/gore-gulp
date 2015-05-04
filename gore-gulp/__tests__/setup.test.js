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
    gg = require(path.join(__dirname, "..", "..")),
    Gulp = require("gulp").Gulp;

describe("setup", function () {
    var fixtureLibraryPath = path.join(__dirname, "..", "..", "__fixtures__", "test-library-1"),
        previousNodeEnv;

    function doTestWebpackSetup(done, environment, taskName) {
        var gulpInstance = new Gulp();

        process.env.NODE_ENV = environment;

        gg(fixtureLibraryPath).setup(gulpInstance);

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
        doTestWebpackSetup(done, "development", "webpack.development");
    });

    it("sets up gulp instance using production settings", function (done) {
        doTestWebpackSetup(done, "production", "webpack.production");
    });

    it("provides the default task", function () {
        var gulpInstance = new Gulp();

        gg(fixtureLibraryPath).setup(gulpInstance);

        assert.ok(gulpInstance.hasTask("default"));
    });
});

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global describe: false, it: false */

var path = require("path"),
    _ = require("lodash"),
    gg = require(path.resolve(__dirname, "..", "..", "index")),
    Gulp = require("gulp").Gulp;

function setupDirectory(baseDir) {
    var gulpInstance = new Gulp();

    gg({
        "baseDir": baseDir,
        "override": function (pckg) {
            return _.merge(pckg, {
                "config": {
                    "isSilent": true
                }
            });
        }
    }).setup(gulpInstance);

    return gulpInstance;
}

describe.skip("karma", function () {
    this.timeout(30000);

    it("starts karma server and runs tests", function (done) {
        var gulpInstance = setupDirectory(path.resolve(__dirname, "..", "..", "__fixtures__", "test-library-10"));

        gulpInstance.on("err", function (err) {
            done(err.err);
        });
        gulpInstance.on("stop", function () {
            done();
        });

        gulpInstance.start("karma");
    });

    it.skip("should not run tests from __fixtures__ directory", function (done) {
        var gulpInstance = setupDirectory(path.resolve(__dirname, "..", "..", "__fixtures__", "test-library-12"));

        gulpInstance.on("err", function (err) {
            done(err.err);
        });
        gulpInstance.on("stop", function () {
            done(new Error("Karma should fail due to no tests to run."));
        });

        gulpInstance.start("karma");
    });
});

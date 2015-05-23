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

describe("karma", function () {
    this.timeout(30000);

    it("starts karma server and runs tests", function (done) {
        var gulpInstance = new Gulp();

        gg({
            "baseDir": path.resolve(__dirname, "..", "..", "__fixtures__", "test-library-10"),
            "override": function (pckg) {
                return _.merge(pckg, {
                    "config": {
                        "isSilent": true
                    }
                });
            }
        }).setup(gulpInstance);

        gulpInstance.on("err", function (err) {
            done(err.err);
        });
        gulpInstance.on("stop", function () {
            done();
        });

        gulpInstance.start("karma");
    });
});

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
    gg = require(path.join(__dirname, "..", "index")),
    Gulp = require("gulp").Gulp;

describe("plugin", function () {
    it("allows to attach a custom plugin", function (done) {
        var gulpInstance = new Gulp();

        gg(path.join(__dirname, "..", "__fixtures__", "test-library-8"))
            .plugin("custom", [], function () {
                return function () {
                    done();
                };
            })
            .setup(gulpInstance);

        gulpInstance.start("custom");
    });

    it("is chainable", function (done) {
        var gulpInstance = new Gulp();

        gg(path.join(__dirname, "..", "__fixtures__", "test-library-8"))
            .plugin("first", [], function () {
                return function () {
                    done();
                };
            })
            .plugin("second", ["first"], function () {
                return _.noop;
            })
            .setup(gulpInstance);

        gulpInstance.start("second");
    });
});

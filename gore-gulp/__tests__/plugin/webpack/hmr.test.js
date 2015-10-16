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
    gg = require("../../../index"),
    Gulp = require("gulp").Gulp;

describe("webpack/hmr", function () {
    it("runs hot module replacement server and serves compiled bundle", function (done) {
        var gulpInstance = new Gulp();

        gg({
            "baseDir": path.resolve(__dirname, "..", "..", "..", "..", "example", "hot-module-replacement")
        }).setup(gulpInstance);

        gulpInstance.on("err", done);
        gulpInstance.on("stop", function () {
            done();
        });

        gulpInstance.start("hmr");
    });
});

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    FS = require("q-io/fs"),
    lint = require(path.join(__dirname, "/lint")),
    test = require(path.join(__dirname, "/test")),
    webpack = require(path.join(__dirname, "/webpack"));

function setup(options, pckgPromise, gulp, self) {
    gulp.task("default", [
        "test"
    ]);
    gulp.task("lint", self.lint(gulp));
    gulp.task("test", [
        "lint"
    ], self.test(gulp));
    gulp.task("webpack", [
        "test"
    ], self.webpack());
}

module.exports = function (baseDir) {
    var pckgPromise = FS.read(path.join(baseDir, "package.json"))
        .then(function (pckgContents) {
            return JSON.parse(pckgContents);
        });

    return {
        "lint": function (gulp) {
            return lint(baseDir, pckgPromise, gulp);
        },
        "setup": function (gulp) {
            return setup(baseDir, pckgPromise, gulp, this);
        },
        "test": function (gulp) {
            return test(baseDir, pckgPromise, gulp);
        },
        "webpack": function () {
            return webpack.full(baseDir, pckgPromise);
        }
    };
};

module.exports.lint = lint;
module.exports.test = test;
module.exports.webpack = webpack;

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    defaults = require(path.join(__dirname, "/defaults")),
    FS = require("q-io/fs"),
    lint = require(path.join(__dirname, "/lint")),
    test = require(path.join(__dirname, "/test")),
    webpack = require(path.join(__dirname, "/webpack"));

function configure(options) {
    return stub.bind(null, options);
}

function setup(options, gulp, tasks, baseDir) {
    gulp.task("default", [
        "test"
    ]);
    gulp.task("lint", tasks.lint(baseDir));
    gulp.task("test", [
        "lint"
    ], tasks.test(baseDir));
}

function stub(options, gulp) {
    var tasks = {
        "lint": lint.bind(null, options, gulp),
        "test": test.bind(null, options, gulp),
        "webpack": {
            "full": webpack.full.bind(null, options),
            "quick": webpack.quick.bind(null, options)
        }
    };

    return {
        "setup": function (baseDir) {
            return setup(options, gulp, tasks, baseDir);
        }
    };
}

module.exports = configure(defaults);

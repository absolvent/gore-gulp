/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    deprecate = require("deprecate"),
    fs = require("fs"),
    lint = require(path.join(__dirname, "/lint")),
    pckg = require(path.join(__dirname, "..", "package.json")),
    Promise = require("bluebird"),
    test = require(path.join(__dirname, "/test")),
    webpack = require(path.join(__dirname, "/webpack"));

function setup(options, pckgPromise, gulp, self) {
    var defaultWebpackVariant;

    if ("production" === process.env.NODE_ENV) {
        defaultWebpackVariant = "webpack.production";
    } else {
        defaultWebpackVariant = "webpack.development";
    }

    gulp.task("default", [
        "test"
    ]);
    gulp.task("lint", self.lint(gulp));
    gulp.task("test", [
        "lint"
    ], self.test(gulp));
    gulp.task("webpack", [
      defaultWebpackVariant
    ]);
    gulp.task("webpack.development", self.webpack.development());
    gulp.task("webpack.full", ["webpack.production"], function () {
        deprecate(pckg.name + " - webpack.full task is deprecated, please use webpack.production instead");
    });
    gulp.task("webpack.production", self.webpack.production());
    gulp.task("webpack.quick", ["webpack.development"], function () {
        deprecate(pckg.name + " - webpack.quick task is deprecated, please use webpack.development instead");
    });
    gulp.task("webpack.react-native", self.webpack.reactNative());
}

function setupTask(baseDir, pckgPromise, task) {
    return function (gulp, override) {
        if (override) {
            pckgPromise = pckgPromise.then(override);
        }

        return task(baseDir, pckgPromise, gulp);
    };
}

module.exports = function (baseDir) {
    var pckgPromise,
        readFile = Promise.promisify(fs.readFile);

    pckgPromise = readFile(path.resolve(baseDir, "package.json"))
        .then(function (pckgContents) {
            return JSON.parse(pckgContents);
        });

    return {
        "lint": setupTask(baseDir, pckgPromise, lint),
        "setup": function (gulp) {
            return setup(baseDir, pckgPromise, gulp, this);
        },
        "test": setupTask(baseDir, pckgPromise, test),
        "webpack": {
            "development": setupTask(baseDir, pckgPromise, webpack.development),
            "production": setupTask(baseDir, pckgPromise, webpack.production),
            "reactNative": setupTask(baseDir, pckgPromise, webpack.reactNative)
        }
    };
};

module.exports.lint = lint;
module.exports.test = test;
module.exports.webpack = webpack;

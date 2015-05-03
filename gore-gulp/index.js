/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    deprecate = require("deprecate"),
    fs = require("fs"),
    lint = require(path.join(__dirname, "/lint")),
    pckg = require(path.join(__dirname, "..", "package.json")),
    Promise = require("bluebird"),
    promisifiedReadFile = Promise.promisify(fs.readFile),
    test = require(path.join(__dirname, "/test")),
    webpack = require(path.join(__dirname, "/webpack"));

function setup(options, pckgPromise, plugins, gulp) {
    var name;

    for (name in plugins) {
        if (plugins.hasOwnProperty(name)) {
            gulp.task(name, plugins[name].dependencies, plugins[name].task(gulp));
        }
    }

    gulp.task("webpack.full", [
        "webpack.production"
    ], function () {
        deprecate(pckg.name + " - webpack.full task is deprecated, please use webpack.production instead");
    });
    gulp.task("webpack.quick", [
        "webpack.development"
    ], function () {
        deprecate(pckg.name + " - webpack.quick task is deprecated, please use webpack.development instead");
    });
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
        plugins = {};

    pckgPromise = promisifiedReadFile(path.resolve(baseDir, "package.json"))
        .then(function (pckgContents) {
            return JSON.parse(pckgContents);
        });

    function plugin(name, dependencies, callback) {
        plugins[name] = {
            "dependencies": dependencies,
            "task": setupTask(baseDir, pckgPromise, callback)
        };
    }

    plugin("lint", [], lint);
    plugin("test", [
        "lint"
    ], test);
    plugin("webpack.development", [
        "test"
    ], webpack.development);
    plugin("webpack.production", [
        "test"
    ], webpack.production);

    if ("production" === process.env.NODE_ENV) {
        plugin("webpack", [
            "webpack.production"
        ], _.noop);
    } else {
        plugin("webpack", [
            "webpack.development"
        ], _.noop);
    }

    return {
        "plugin": plugin,
        "plugins": plugins,
        "setup": function (gulp) {
            return setup(baseDir, pckgPromise, plugins, gulp);
        }
    };
};

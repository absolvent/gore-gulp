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
    lint = require(path.join(__dirname, "plugin", "lint")),
    pckg = require(path.join(__dirname, "..", "package.json")),
    Promise = require("bluebird"),
    promisifiedReadFile = Promise.promisify(fs.readFile),
    test = require(path.join(__dirname, "plugin", "test")),
    webpack = require(path.join(__dirname, "plugin", "webpack"));

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

function setupTask(baseDir, pckgPromise, factory) {
    return function (gulp, override) {
        if (override) {
            pckgPromise = pckgPromise.then(override);
        }

        return factory(baseDir, pckgPromise, gulp);
    };
}

module.exports = function (baseDir) {
    var pckgPromise,
        plugins = {},
        ret;

    pckgPromise = promisifiedReadFile(path.resolve(baseDir, "package.json"))
        .then(function (pckgContents) {
            return JSON.parse(pckgContents);
        });

    function plugin(definition) {
        plugins[definition.name] = {
            "dependencies": definition.dependencies,
            "task": setupTask(baseDir, pckgPromise, definition.factory)
        };

        return ret;
    }

    ret = {
        "plugin": plugin,
        "plugins": plugins,
        "setup": function (gulp) {
            return setup(baseDir, pckgPromise, plugins, gulp);
        }
    };

    plugin({
        "dependencies": [],
        "factory": lint,
        "name": "lint"
    });
    plugin({
        "dependencies": [
            "lint"
        ],
        "factory": test,
        "name": "test"
    });
    plugin({
        "dependencies": [
            "test"
        ],
        "factory": webpack.development,
        "name": "webpack.development"
    });
    plugin({
        "dependencies": [
            "test"
        ],
        "factory": webpack.production,
        "name": "webpack.production"
    });

    if ("production" === process.env.NODE_ENV) {
        plugin({
            "dependencies": [
                "webpack.production"
            ],
            "factory": _.noop,
            "name": "webpack"
        });
    } else {
        plugin({
            "dependencies": [
                "webpack.development"
            ],
            "factory": _.noop,
            "name": "webpack"
        });
    }

    return ret;
};

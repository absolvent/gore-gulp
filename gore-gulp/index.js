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
    lint = require(path.resolve(__dirname, "plugin", "lint")),
    pckg = require(path.resolve(__dirname, "..", "package.json")),
    Promise = require("bluebird"),
    test = require(path.resolve(__dirname, "plugin", "test")),
    webpack = require(path.resolve(__dirname, "plugin", "webpack"));

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

function setupDependencies(config, dependencies) {
    if (!_.isEmpty(config.dependencies)) {
        return config.dependencies.concat(dependencies);
    }

    return dependencies;
}

function setupTask(config, pckgPromise, factory) {
    return function (gulp, override) {
        if (override) {
            pckgPromise = pckgPromise.then(override);
        }

        return factory(config, pckgPromise, gulp);
    };
}

module.exports = function (config) {
    var pckgPromise,
        plugins = {},
        ret;

    if ("string" === typeof config) {
        config = {
            "baseDir": config
        };
    }

    config = _.merge({
        "dependencies": [],
        "override": _.identity
    }, config);

    pckgPromise = Promise.fromNode(function (cb) {
        fs.readFile(path.resolve(config.baseDir, "package.json"), cb);
    }).then(function (pckgContents) {
        return JSON.parse(pckgContents);
    }).then(config.override);

    function plugin(definition) {
        plugins[definition.name] = {
            "dependencies": setupDependencies(config, definition.dependencies),
            "task": setupTask(config, pckgPromise, definition.factory)
        };

        return ret;
    }

    ret = {
        "plugin": plugin,
        "plugins": plugins,
        "setup": function (gulp) {
            return setup(config, pckgPromise, plugins, gulp);
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
        "factory": webpack.hmr,
        "name": "hmr"
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

    plugin({
        "dependencies": [
            "webpack"
        ],
        "factory": _.noop,
        "name": "build"
    });

    plugin({
        "dependencies": [
            "webpack"
        ],
        "factory": _.noop,
        "name": "default"
    });

    plugin({
        "dependencies": [
            "webpack.production"
        ],
        "factory": _.noop,
        "name": "heroku:production"
    });

    return ret;
};

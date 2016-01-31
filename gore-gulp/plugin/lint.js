/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var ecmaScriptFileExtensionsGlobPattern = require("../pckg/ecmaScriptFileExtensionsGlobPattern"),
    eslint = require("space-preconfigured-eslint"),
    fs = require("fs"),
    globSpread = require("../globSpread"),
    keys = require("lodash/keys"),
    path = require("path"),
    Promise = require("bluebird");

function awaitEslintrc(config) {
    var bundledEslintrc = path.resolve(__dirname, "..", "..", "eslint", "eslintrc.js"),
        userEslintrc = path.resolve(config.baseDir, ".eslintrc");

    return new Promise(function (resolve, reject) {
        fs.stat(userEslintrc, function (err, stat) {
            if (err) {
                if ("ENOENT" === err.code) {
                    resolve(bundledEslintrc);
                } else {
                    reject(err);
                }
            } else if (stat.isFile()) {
                resolve(userEslintrc);
            } else {
                resolve(bundledEslintrc);
            }
        });
    });
}

function awaitGlobPattern(config, pckgPromise) {
    return pckgPromise.then(function (pckg) {
        return [
            path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "*" + ecmaScriptFileExtensionsGlobPattern(pckg)),
            "!" + path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "__fixtures__", "**", "*")
        ];
    });
}

module.exports = function (config, pckgPromise) {
    var initPromises = [
        awaitEslintrc(config),
        awaitGlobPattern(config, pckgPromise),
        pckgPromise
    ];

    return function () {
        return Promise.all(initPromises).spread(function (eslintrc, globPattern, pckg) {
            return eslint(globPattern, {
                "configFile": eslintrc,
                "globals": keys(pckg.provide)
            });
        });
    };
};

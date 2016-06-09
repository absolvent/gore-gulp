/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const ecmaScriptFileExtensionsGlobPattern = require("../pckg/ecmaScriptFileExtensionsGlobPattern");
const eslint = require("lookly-preset-eslint");
const fs = require("fs");
const globSpread = require("../globSpread");
const keys = require("lodash/keys");
const path = require("path");
const Promise = require("bluebird");

function awaitEslintrc(config) {
    const bundledEslintrc = path.resolve(__dirname, "..", "..", "eslint", "eslintrc.js");
    const userEslintrc = path.resolve(config.baseDir, ".eslintrc");

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
    const initPromises = [
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

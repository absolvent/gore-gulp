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
    defaults = require(path.join(__dirname, "/defaults")),
    eslint = require("gulp-eslint"),
    fs = require("fs"),
    gulpif = require("gulp-if"),
    Promise = require("bluebird");

function awaitEslintrc(baseDir) {
    var bundledEslintrc = path.join(__dirname, "..", "eslint", ".eslintrc"),
        userEslintrc = path.join(baseDir, ".eslintrc");

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

function awaitGlobPattern(baseDir, pckgPromise) {
    return pckgPromise.then(function (pckg) {
        return path.resolve(baseDir, pckg.directories.lib, "**", "*" + defaults.ecmaScriptFileExtensionsGlobPattern);
    });
}

module.exports = function (baseDir, pckgPromise, gulp) {
    var initPromises = [
        awaitEslintrc(baseDir),
        awaitGlobPattern(baseDir, pckgPromise)
    ];

    return function () {
        return Promise.all(initPromises)
            .spread(function (eslintrc, globPattern) {
                return new Promise(function (resolve, reject) {
                    gulp.src(globPattern)
                        .pipe(eslint({
                            "configFile": eslintrc
                        }))
                        .pipe(gulpif(!gulp.isSilent, eslint.format()))
                        .pipe(eslint.failAfterError())
                        // force data to flow by reading from pipe
                        .on("data", _.noop)
                        .on("error", reject)
                        .on("finish", resolve);
                });
            });
    };
};

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
    eslint = require("gulp-eslint"),
    Promise = require("bluebird");

module.exports = function (baseDir, pckgPromise, gulp) {
    var eslintrc = path.join(__dirname, "..", "eslint", ".eslintrc");

    return function () {
        return pckgPromise.then(function (pckg) {
                return path.resolve(baseDir, pckg.directories.lib, "**", "*" + defaults.ecmaScriptFileExtensionsGlobPattern);
            })
            .then(function (globPattern) {
                return new Promise(function (resolve, reject) {
                    gulp.src(globPattern)
                        .pipe(eslint(eslintrc))
                        .pipe(eslint.format())
                        .pipe(eslint.failOnError())
                        .on("data", function () {
                            // console.log(data);
                        })
                        .on("error", reject)
                        .on("finish", resolve);
                });
            });
    };
};

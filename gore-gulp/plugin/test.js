/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    assert = require("chai").assert,
    defaults = require(path.join(__dirname, "..", "defaults")),
    mocha = require("gulp-mocha"),
    Promise = require("bluebird");

function detectTestFileExtensionPrefix(pckg) {
    if (pckg.config && pckg.config.testFileExtensionPrefix) {
        assert.isString(pckg.config.testFileExtensionPrefix);

        return pckg.config.testFileExtensionPrefix;
    }

    return ".test";
}

module.exports = function (config, pckgPromise, gulp) {
    return function () {
        return pckgPromise.then(function (pckg) {
                var testFileExtensionPrefix = detectTestFileExtensionPrefix(pckg);

                return path.resolve(config.baseDir, pckg.directories.lib, "**", "*" + testFileExtensionPrefix + defaults.ecmaScriptFileExtensionsGlobPattern);
            })
            .then(function (globPattern) {
                return new Promise(function (resolve, reject) {
                    gulp.src(globPattern)
                        .pipe(mocha({
                            "bail": true,
                            "reporter": "dot"
                        }))
                        .on("error", reject)
                        .on("end", resolve);
                });
            });
    };
};

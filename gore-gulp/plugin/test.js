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
    detectTestFileExtensionPrefix = require(path.resolve(__dirname, "..", "pckg", "detectTestFileExtensionPrefix")),
    isSilent = require(path.resolve(__dirname, "..", "pckg", "isSilent")),
    mocha = require("gulp-mocha"),
    Promise = require("bluebird");

function selectReporter(pckg) {
    if (isSilent(pckg)) {
        return _.noop;
    }

    return "dot";
}

module.exports = function (config, pckgPromise, gulp) {
    return function () {
        return pckgPromise.then(function (pckg) {
            var globPattern,
                testFileExtensionPrefix = detectTestFileExtensionPrefix(pckg);

            globPattern = path.resolve(config.baseDir, pckg.directories.lib, "**", "*" + testFileExtensionPrefix + ".js");

            return new Promise(function (resolve, reject) {
                gulp.src(globPattern)
                    .pipe(mocha({
                        "bail": true,
                        "reporter": selectReporter(pckg)
                    }))
                    .on("error", reject)
                    .on("end", resolve);
            });
        });
    };
};

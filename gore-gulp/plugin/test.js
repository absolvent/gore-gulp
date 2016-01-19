/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var detectTestFileExtensionPrefix = require("../pckg/detectTestFileExtensionPrefix"),
    glob = require("glob"),
    globSpread = require("../globSpread"),
    isSilent = require("../pckg/isSilent"),
    mocha = require("gulp-mocha"),
    noop = require("lodash/noop"),
    path = require("path"),
    Promise = require("bluebird");

function selectReporter(pckg) {
    if (isSilent(pckg)) {
        return noop;
    }

    return "dot";
}

module.exports = function (config, pckgPromise, gulp) {
    return function () {
        return pckgPromise.then(function (pckg) {
            var testFileExtensionPrefix = detectTestFileExtensionPrefix(pckg);

            return Promise.props({
                "pckg": pckg,
                "testFiles": Promise.fromNode(function (cb) {
                    glob(path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "*" + testFileExtensionPrefix + ".js"), cb);
                })
            });
        }).then(function (results) {
            if (results.testFiles.length < 1) {
                // do not bother
                return Promise.resolve();
            }

            return new Promise(function (resolve, reject) {
                gulp.src(results.testFiles)
                    .pipe(mocha({
                        "bail": true,
                        "reporter": selectReporter(results.pckg)
                    }))
                    .on("error", reject)
                    .on("end", resolve);
            });
        });
    };
};

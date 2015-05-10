/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    defaults = require(path.resolve(__dirname, "..", "..", "defaults")),
    fs = require("fs"),
    // karma = require("karma"),
    mustache = require("mustache"),
    Promise = require("bluebird"),
    promisifiedReadFile = Promise.promisify(fs.readFile);

function awaitPreprocessorTemplate() {
    return promisifiedReadFile(path.resolve(__dirname, "..", "..", "..", "karma", "preprocessor.js.mustache"))
        .then(function (preprocessorTemplateBuffer) {
            return preprocessorTemplateBuffer.toString();
        });
}

module.exports = function (config) {
    return function () {
        var initPromises = [
            awaitPreprocessorTemplate()
        ];

        return Promise.all(initPromises)
            .spread(function (preprocessorTemplate) {
                return mustache.render(preprocessorTemplate, {
                    "config": config,
                    "defaults": defaults
                });
            })
            .then(function (preprocessorCode) {
                console.log(preprocessorCode);
            });
        // return new Promise(function (resolve, reject) {
            // karma.server.start({
            //     "configFile": path.resolve(__dirname, "..", "..", "..", "karma", "karma.conf.js")
            // }, function (exitCode) {
            //     if (0 === exitCode) {
            //         resolve();
            //     } else {
            //         reject(new Error("Karma has exited with non-zero exit code: " + exitCode));
            //     }
            // });
        // });
    };
};

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var karma = require("karma"),
    Promise = require("bluebird");

module.exports = function () {
    return function () {
        return new Promise(function (resolve, reject) {
            karma.runner.run({
                "port": 9876
            }, function (exitCode) {
                if (0 === exitCode) {
                    resolve();
                } else {
                    reject(new Error("Karma runner has exited with non-zero exit code: " + exitCode));
                }
            });
        });
    };
};

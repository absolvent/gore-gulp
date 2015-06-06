/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var Promise = require("bluebird"),
    resolve = require("resolve");

function promisifiedResolve(baseDir, name) {
    return Promise.fromNode(function (cb) {
        resolve(name, {
            "basedir": baseDir
        }, cb);
    });
}

function findPackage(config, name) {
    return promisifiedResolve(config.baseDir, name)
        .catch(function () {
            return promisifiedResolve(__dirname, name);
        });
}

module.exports = findPackage;

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

function findPackage(config, name) {
    return new Promise(function (res) {
        res(resolve.sync(name, {
            "basedir": config.baseDir
        }));
    });
}

module.exports = findPackage;

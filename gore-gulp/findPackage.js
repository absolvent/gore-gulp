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
    return Promise.fromNode(function (cb) {
        resolve(name, {
            "basedir": __dirname
        }, cb);
    });
}

module.exports = findPackage;

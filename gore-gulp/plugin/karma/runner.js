/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var Promise = require("bluebird");

module.exports = function () {
    return function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
};

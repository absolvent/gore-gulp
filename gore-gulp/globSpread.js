/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var isArray = require("lodash/isArray");

function globSpread(pattern) {
    if (isArray(pattern)) {
        return "{" + pattern.join(",") + "}";
    }

    return pattern;
}

module.exports = globSpread;

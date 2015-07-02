/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash");

function libDirs(pckg) {
    if (_.isArray(pckg.directories.lib)) {
        return pckg.directories.lib;
    }

    return [
        pckg.directories.lib
    ];
}

module.exports = libDirs;

/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path");

function libDir(pckg, config) {
    return path.resolve(config.baseDir, pckg.directories.lib);
}

module.exports = libDir;

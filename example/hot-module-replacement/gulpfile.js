/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    gg = require(path.join(__dirname, "..", "..", "gore-gulp")),
    gulp = require("gulp");

gg(__dirname).setup(gulp);

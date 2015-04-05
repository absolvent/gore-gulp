/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    pckg = require(path.join(__dirname, "package.json")),
    gg = require(path.join(__dirname, pckg.name)),
    gulp = require("gulp");

gg(__dirname).setup(gulp);

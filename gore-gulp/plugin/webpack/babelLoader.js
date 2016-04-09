/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const config = require("../babel/config");
const vanillaBabelLoader = require("babel-loader");

function babelLoader(source, initialSourceMap) {
    this.options.babel = config;

    return vanillaBabelLoader.call(this, source, initialSourceMap);
}

module.exports = babelLoader;

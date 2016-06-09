/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const config = require("lookly-preset-babel");
const loaderUtils = require("loader-utils");
const vanillaBabelLoader = require("babel-loader");

function babelLoader(source, initialSourceMap) {
    const query = loaderUtils.parseQuery(this.query);

    this.options.babel = config();
    this.options.babel.cacheDirectory = query.cacheDirectory;
    this.options.babel.cacheIdentifier = query.cacheIdentifier;

    this.query = "";
    vanillaBabelLoader.call(this, source, initialSourceMap);
}

module.exports = babelLoader;

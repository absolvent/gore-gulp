/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

function webpackGetOutputFilename(webpackConfig, entry) {
    return webpackConfig.output.filename.replace("[name]", entry);
}

module.exports = webpackGetOutputFilename;

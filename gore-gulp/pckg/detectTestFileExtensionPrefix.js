/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var assert = require("chai").assert;

function detectTestFileExtensionPrefix(pckg) {
    if (pckg.config && pckg.config.testFileExtensionPrefix) {
        assert.isString(pckg.config.testFileExtensionPrefix);

        return pckg.config.testFileExtensionPrefix;
    }

    return ".test";
}

module.exports = detectTestFileExtensionPrefix;

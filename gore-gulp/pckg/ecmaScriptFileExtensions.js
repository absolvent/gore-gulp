/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const ecmaScriptFileExtensionsList = [
    "",
    ".coffee",
    ".js",
    ".jsx",
    ".min.js"
];

function ecmaScriptFileExtensions() {
    return ecmaScriptFileExtensionsList;
}

module.exports = ecmaScriptFileExtensions;

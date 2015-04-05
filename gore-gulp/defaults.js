/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var ecmaScriptFileExtensions = [
    "",
    ".coffee",
    ".js",
    ".jsx"
];

module.exports = {
    "ecmaScriptFileExtensionsGlobPattern": "{" + ecmaScriptFileExtensions
        .filter(function (extension) {
            return extension;
        })
        .join(",") + "}",
    "ecmaScriptFileExtensions": ecmaScriptFileExtensions
};

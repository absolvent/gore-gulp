/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash"),
    ecmaScriptFileExtensions,
    notEmptyExtensions;

ecmaScriptFileExtensions = [
    "",
    ".coffee",
    ".js",
    ".jsx",
    ".min.js"
];

notEmptyExtensions = _.filter(ecmaScriptFileExtensions);

module.exports = {
    "ecmaScriptFileExtensions": ecmaScriptFileExtensions,
    "ecmaScriptFileExtensionsGlobPattern": "{" + notEmptyExtensions.join(",") + "}",
    "ecmaScriptTestFileExtensionsRegExp": new RegExp(".*" + _.escapeRegExp(".test") + "(" + notEmptyExtensions.join("|") + ")" + "$")
};

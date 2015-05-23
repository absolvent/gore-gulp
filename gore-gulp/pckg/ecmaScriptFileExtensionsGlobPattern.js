/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var _ = require("lodash"),
    path = require("path"),
    ecmaScriptFileExtensions = require(path.resolve(__dirname, "ecmaScriptFileExtensions"));

function ecmaScriptFileExtensionsGlobPattern(pckg) {
    var ecmaScriptFileExtensionsList = ecmaScriptFileExtensions(pckg),
        notEmptyExtensions = _.filter(ecmaScriptFileExtensionsList);

    return "{" + notEmptyExtensions.join(",") + "}";
}

module.exports = ecmaScriptFileExtensionsGlobPattern;

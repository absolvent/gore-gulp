/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var ecmaScriptFileExtensions = require("./ecmaScriptFileExtensions"),
    filter = require("lodash/collection/filter");

function ecmaScriptFileExtensionsGlobPattern(pckg) {
    var ecmaScriptFileExtensionsList = ecmaScriptFileExtensions(pckg),
        notEmptyExtensions = filter(ecmaScriptFileExtensionsList);

    return "{" + notEmptyExtensions.join(",") + "}";
}

module.exports = ecmaScriptFileExtensionsGlobPattern;

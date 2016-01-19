/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var ecmaScriptFileExtensions = require("./ecmaScriptFileExtensions"),
    escapeRegExp = require("lodash/escapeRegExp"),
    filter = require("lodash/filter");

function ecmaScriptTestFileExtensionsRegExp(pckg, prefix) {
    var ecmaScriptFileExtensionsList = ecmaScriptFileExtensions(pckg),
        notEmptyExtensions = filter(ecmaScriptFileExtensionsList);

    return new RegExp("^((?!__fixtures__).)*" + escapeRegExp(prefix) + "(" + notEmptyExtensions.join("|") + ")" + "$");
}

module.exports = ecmaScriptTestFileExtensionsRegExp;

/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const ecmaScriptFileExtensionsGlobPattern = require("./pckg/ecmaScriptFileExtensionsGlobPattern");
const globSpread = require("./globSpread");
const path = require("path");

function awaitGlobPattern(config, pckgPromise) {
    return pckgPromise.then(function (pckg) {
        return [
            path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "*" + ecmaScriptFileExtensionsGlobPattern(pckg)),
            "!" + path.resolve(config.baseDir, globSpread(pckg.directories.lib), "**", "__fixtures__", "**", "*")
        ];
    });
}

module.exports = awaitGlobPattern;

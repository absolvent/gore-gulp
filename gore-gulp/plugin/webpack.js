/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    _ = require("lodash"),
    development = require(path.resolve(__dirname, "..", "webpack", "config", "development")),
    ecmaScriptFileExtensions = require(path.resolve(__dirname, "..", "pckg", "ecmaScriptFileExtensions")),
    ecmaScriptFileExtensionsGlobPattern = require(path.resolve(__dirname, "..", "pckg", "ecmaScriptFileExtensionsGlobPattern")),
    glob = require("glob"),
    libDir = require(path.resolve(__dirname, "..", "pckg", "libDir")),
    production = require(path.resolve(__dirname, "..", "webpack", "config", "production")),
    Promise = require("bluebird"),
    webpack = require("webpack");

function normalizeEntries(config, pckg, entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(config, pckg, entries[i], ecmaScriptFileExtensions(pckg))] = entries[i];
    }

    return ret;
}

function normalizeEntry(config, pckg, entry, fileExtensions) {
    var i,
        entryPointStem,
        fileExtension;

    for (i = 0; i < fileExtensions.length; i += 1) {
        fileExtension = ".entry" + fileExtensions[i];
        if (_.endsWith(entry, fileExtension)) {
            entryPointStem = path.relative(path.resolve(config.baseDir, pckg.directories.lib), entry);
            // replace all path.sep with spaces for more meaningful slugss
            entryPointStem = entryPointStem.split(path.sep).join(" ");
            entryPointStem = entryPointStem.substr(0, entryPointStem.length - fileExtension.length);

            return _.kebabCase(entryPointStem);
        }
    }

    return entry;
}

function run(config) {
    return new Promise(function (resolve, reject) {
        webpack(config, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function setupVariant(variant) {
    return function (config, pckgPromise) {
        return function () {
            return pckgPromise.then(function (pckg) {
                    return Promise.fromNode(function (cb) {
                            glob(path.resolve(libDir(pckg, config), "**", "*.entry" + ecmaScriptFileExtensionsGlobPattern(pckg)), cb);
                        })
                        .then(function (entries) {
                            return [
                                pckg,
                                normalizeEntries(config, pckg, entries)
                            ];
                        });
                })
                .spread(function (pckg, entries) {
                    return variant({}, config, pckg, entries);
                })
                .then(run);
        };
    };
}

module.exports = {
    "development": setupVariant(development),
    "production": setupVariant(production)
};

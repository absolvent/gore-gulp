/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var development = require("./config/babel/web/development"),
    ecmaScriptFileExtensions = require("../../pckg/ecmaScriptFileExtensions"),
    ecmaScriptFileExtensionsGlobPattern = require("../../pckg/ecmaScriptFileExtensionsGlobPattern"),
    endsWith = require("lodash/endsWith"),
    glob = require("glob"),
    kebabCase = require("lodash/kebabCase"),
    libDirs = require("../../pckg/libDirs"),
    map = require("lodash/map"),
    merge = require("lodash/merge"),
    path = require("path"),
    production = require("./config/babel/web/production"),
    Promise = require("bluebird"),
    reduce = require("lodash/reduce"),
    webpack = require("webpack");

function normalizeEntries(config, pckg, libDir, entries) {
    var i,
        ret = {};

    for (i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(config, pckg, libDir, entries[i], ecmaScriptFileExtensions(pckg))] = entries[i];
    }

    return ret;
}

function normalizeEntry(config, pckg, libDir, entry, fileExtensions) {
    var i,
        entryPointStem,
        fileExtension;

    for (i = 0; i < fileExtensions.length; i += 1) {
        fileExtension = ".entry" + fileExtensions[i];
        if (endsWith(entry, fileExtension)) {
            entryPointStem = path.relative(path.resolve(config.baseDir, libDir), entry);
            // replace all path.sep with spaces for more meaningful slugss
            entryPointStem = entryPointStem.split(path.sep).join(" ");
            entryPointStem = entryPointStem.substr(0, entryPointStem.length - fileExtension.length);

            return kebabCase(entryPointStem);
        }
    }

    return entry;
}

function run(pckg, entries, webpackConfig) {
    return new Promise(function (resolve, reject) {
        webpack(webpackConfig, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve([
                    pckg, entries, webpackConfig
                ]);
            }
        });
    });
}

function setupVariant(variant) {
    return function (config, pckgPromise) {
        return function () {
            return pckgPromise.then(function (pckg) {
                return Promise.all(map(libDirs(pckg), function (libDir) {
                    return Promise.fromNode(function (cb) {
                        glob(path.resolve(config.baseDir, libDir, "**", "*.entry" + ecmaScriptFileExtensionsGlobPattern(pckg)), cb);
                    }).then(function (entries) {
                        return normalizeEntries(config, pckg, libDir, entries);
                    });
                })).then(function (entries) {
                    return [
                        pckg,
                        reduce(entries, function (acc, entry) {
                            return merge(acc, entry);
                        }, {})
                    ];
                });
            }).spread(function (pckg, entries) {
                return [
                    pckg,
                    entries,
                    variant({}, config, pckg, entries)
                ];
            }).spread(function (pckg, entries, webpackConfig) {
                return run(pckg, entries, webpackConfig);
            });
        };
    };
}

module.exports = {
    "development": setupVariant(development),
    "production": setupVariant(production)
};

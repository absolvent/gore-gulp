/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const babel = require("../babel");
const development = require("./config/babel/web/development");
const ecmaScriptFileExtensions = require("../../pckg/ecmaScriptFileExtensions");
const ecmaScriptFileExtensionsGlobPattern = require("../../pckg/ecmaScriptFileExtensionsGlobPattern");
const endsWith = require("lodash/endsWith");
const glob = require("glob");
const kebabCase = require("lodash/kebabCase");
const libDirs = require("../../pckg/libDirs");
const map = require("lodash/map");
const merge = require("lodash/merge");
const path = require("path");
const production = require("./config/babel/web/production");
const Promise = require("bluebird");
const reduce = require("lodash/reduce");
const webpack = require("webpack");
const webpackGetOutputFilename = require("./webpackGetOutputFilename");

function normalizeEntries(config, pckg, libDir, entries) {
    const ret = {};

    for (let i = 0; i < entries.length; i += 1) {
        ret[normalizeEntry(config, pckg, libDir, entries[i], ecmaScriptFileExtensions(pckg))] = entries[i];
    }

    return ret;
}

function normalizeEntry(config, pckg, libDir, entry, fileExtensions) {
    for (let i = 0; i < fileExtensions.length; i += 1) {
        let fileExtension = ".entry" + fileExtensions[i];
        if (endsWith(entry, fileExtension)) {
            let entryPointStem = path.relative(path.resolve(config.baseDir, libDir), entry);
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
                    return Promise.fromCallback(function (cb) {
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
            }).spread(run).spread(function (pckg, entries, webpackConfig) {
                return Promise.all(Object.keys(entries).map(function (entry) {
                    const outputFilename = webpackGetOutputFilename(webpackConfig, entry);

                    return babel.inPlace(path.resolve(webpackConfig.output.path, outputFilename));
                })).then(function () {
                    return [pckg, entries, webpackConfig];
                });
            });
        };
    };
}

module.exports = {
    "development": setupVariant(development),
    "production": setupVariant(production)
};

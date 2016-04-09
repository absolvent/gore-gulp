/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const chunk = require("lodash/chunk");
const ecmaScriptFileExtensions = require("../../pckg/ecmaScriptFileExtensions");
const ecmaScriptFileExtensionsGlobPattern = require("../../pckg/ecmaScriptFileExtensionsGlobPattern");
const endsWith = require("lodash/endsWith");
const flatten = require("lodash/flatten");
const glob = require("ultra-glob");
const groupBy = require("lodash/groupBy");
const kebabCase = require("lodash/kebabCase");
const libDirs = require("../../pckg/libDirs");
const map = require("lodash/map");
const mapValues = require("lodash/mapValues");
const os = require("os");
const path = require("path");
const Promise = require("bluebird");
const reduce = require("lodash/reduce");
const values = require("lodash/values");
const workerFarm = require("worker-farm");

const cpus = os.cpus();

function groupEntries(config, pckgPromise) {
    return pckgPromise.then(pckg => {
        return Promise.all(map(libDirs(pckg), function (libDir) {
            const pattern = path.resolve(config.baseDir, libDir, "**", "*.entry" + ecmaScriptFileExtensionsGlobPattern(pckg));

            return glob(pattern).then(entries => {
                return map(entries, entry => ({
                    "entry": entry,
                    "libDir": libDir,
                    "pckg": pckg
                }));
            });
        })).then(results => {
            return flatten(results);
        }).then(results => {
            return groupBy(results, "libDir");
        }).then(results => {
            return values(mapValues(results, entryPoints => {
                const chunkLength = Math.ceil(entryPoints.length / cpus.length);

                return chunk(entryPoints, chunkLength);
            }));
        }).then(results => {
            return map(results, entryPointsChunk => {
                return map(entryPointsChunk, entryPoints => {
                    return reduce(entryPoints, (acc, entryPoint) => {
                        return {
                            "entries": acc.entries.concat(entryPoint.entry),
                            "libDir": entryPoint.libDir,
                            "pckg": entryPoint.pckg
                        };
                    }, {
                        "entries": [],
                        "libDir": null,
                        "pckg": null
                    });
                });
            });
        }).then(results => {
            return flatten(results);
        }).then(results => {
            return map(results, result => {
                return {
                    "entries": normalizeEntries(config, result.pckg, result.libDir, result.entries),
                    "pckg": result.pckg
                };
            });
        });
    });
}

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

function setupVariant(variant) {
    return function (config, pckgPromise) {
        return function () {
            const runnerPath = require.resolve(path.resolve(__dirname, "forkableRunner"));
            const workers = workerFarm(runnerPath);

            return groupEntries(config, pckgPromise).then(results => {
                return Promise.all(results.map(result => {
                    return Promise.fromCallback(callback => {
                        workers({
                            "config": {
                                "baseDir": config.baseDir
                            },
                            "entries": result.entries,
                            "pckg": result.pckg,
                            "variant": variant
                        }, callback);
                    });
                }));
            }).finally(() => {
                workerFarm.end(workers);
            });
        };
    };
}

module.exports = {
    "development": setupVariant("development"),
    "production": setupVariant("production")
};

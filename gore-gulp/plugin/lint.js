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
    ecmaScriptFileExtensionsGlobPattern = require(path.resolve(__dirname, "..", "pckg", "ecmaScriptFileExtensionsGlobPattern")),
    findPackage = require(path.resolve(__dirname, "..", "findPackage")),
    fs = require("fs"),
    glob = require("glob"),
    gutil = require("gulp-util"),
    isSilent = require(path.resolve(__dirname, "..", "pckg", "isSilent")),
    CLIEngine = require("eslint").CLIEngine,
    Promise = require("bluebird");

function awaitEslintrc(config) {
    var bundledEslintrc = path.resolve(__dirname, "..", "..", "eslint", ".eslintrc"),
        userEslintrc = path.resolve(config.baseDir, ".eslintrc");

    return new Promise(function (resolve, reject) {
        fs.stat(userEslintrc, function (err, stat) {
            if (err) {
                if ("ENOENT" === err.code) {
                    resolve(bundledEslintrc);
                } else {
                    reject(err);
                }
            } else if (stat.isFile()) {
                resolve(userEslintrc);
            } else {
                resolve(bundledEslintrc);
            }
        });
    });
}

function awaitGlobPattern(config, pckgPromise) {
    return pckgPromise.then(function (pckg) {
        return {
            "pattern": path.resolve(config.baseDir, pckg.directories.lib, "**", "*" + ecmaScriptFileExtensionsGlobPattern(pckg)),
            "ignore": path.resolve(config.baseDir, pckg.directories.lib, "**", "__fixtures__", "**", "*")
        };
    });
}

module.exports = function (config, pckgPromise) {
    var initPromises = [
        awaitEslintrc(config),
        awaitGlobPattern(config, pckgPromise),
        pckgPromise,
        findPackage(config, "eslint-plugin-react").then(require)
    ];

    return function () {
        return Promise.all(initPromises).spread(function (eslintrc, globPattern, pckg, eslintPluginReact) {
            return Promise.fromNode(function (cb) {
                    glob(globPattern.pattern, {
                        "ignore": globPattern.ignore
                    }, cb);
                })
                .then(function (lintableFiles) {
                    var cli;

                    if (lintableFiles.length < 1) {
                        // do not bother
                        return Promise.resolve();
                    }

                    cli = new CLIEngine({
                        "configFile": eslintrc,
                        "globals": _.keys(pckg.provide),
                        "useEslintrc": false
                    });

                    // !isSilent(pckg)
                    cli.addPlugin("react", eslintPluginReact);

                    return Promise.props({
                        "cli": cli,
                        "formatter": cli.getFormatter(),
                        "report": cli.executeOnFiles(lintableFiles)
                    });
                })
                .then(function (results) {
                    if (!results) {
                        return;
                    }

                    if ((results.report.errorCount || results.report.warningCount) && !isSilent(pckg)) {
                        gutil.log(results.formatter(results.report.results));
                    }

                    if (results.report.errorCount) {
                        throw new gutil.PluginError({
                            "plugin": "ESLint",
                            "message": new Error("ESLint detected errors.")
                        });
                    }
                });
        });
    };
};

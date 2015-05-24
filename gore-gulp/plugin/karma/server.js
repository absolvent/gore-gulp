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
    ecmaScriptTestFileExtensionsRegExp = require(path.resolve(__dirname, "..", "..", "pckg", "ecmaScriptTestFileExtensionsRegExp")),
    fs = require("fs"),
    karma = require("karma"),
    karmaWebpackConfig = require(path.resolve(__dirname, "..", "..", "webpack", "config", "karma")),
    mustache = require("mustache"),
    Promise = require("bluebird"),
    tmp = require("tmp"),
    promisifiedReadFile = Promise.promisify(fs.readFile),
    promisifiedTmpFile = Promise.promisify(tmp.file),
    promisifiedWriteFile = Promise.promisify(fs.writeFile);

function awaitPreprocessorCode(config, pckg) {
    return promisifiedReadFile(path.resolve(__dirname, "..", "..", "..", "karma", "preprocessor.js.mustache"))
        .then(function (preprocessorTemplateBuffer) {
            return preprocessorTemplateBuffer.toString();
        })
        .then(function (preprocessorTemplate) {
            return mustache.render(preprocessorTemplate, {
                "config": config,
                "ecmaScriptTestFileExtensionsRegExp": ecmaScriptTestFileExtensionsRegExp(pckg, ".karma")
            });
        });
}

module.exports = function (config, pckgPromise) {
    return function () {
        var cleanupCallback;

        return Promise.props({
                "pckg": pckgPromise,
                "tmpfile": promisifiedTmpFile({
                    "postfix": ".js"
                })
            })
            .then(function (results) {
                return Promise.props(_.merge(results, {
                    "preprocessorCode": awaitPreprocessorCode(config, results.pckg)
                }));
            })
            .then(function (results) {
                cleanupCallback = results.tmpfile[2];

                return Promise.props(_.merge(results, {
                    "preprocessorPath": promisifiedWriteFile(results.tmpfile[0], results.preprocessorCode)
                        .then(function () {
                            return results.tmpfile[0];
                        })
                }));
            })
            .then(function (results) {
                return new Promise(function (resolve, reject) {
                    var preprocessors = {};

                    preprocessors[results.preprocessorPath] = [
                        "sourcemap",
                        "webpack"
                    ];

                    karma.server.start({
                        "browsers": [
                            "PhantomJS"
                        ],
                        "files": [
                            require.resolve("babel-core/browser-polyfill"),
                            results.preprocessorPath
                        ],
                        "frameworks": [
                            "mocha"
                        ],
                        "preprocessors": preprocessors,
                        "reporters": [
                            "dots"
                        ],
                        "singleRun": true,
                        "webpack": karmaWebpackConfig({}, config, results.pckg),
                        "webpackServer": {
                            "noInfo": true
                        }
                    }, function (exitCode) {
                        if (0 === exitCode) {
                            resolve();
                        } else {
                            reject(new Error("Karma server has exited with non-zero exit code: " + exitCode));
                        }
                    });
                });
            })
            .finally(function () {
                if (cleanupCallback) {
                    cleanupCallback();
                }
            });
    };
};

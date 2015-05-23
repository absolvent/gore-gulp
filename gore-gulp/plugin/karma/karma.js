/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var path = require("path"),
    portscanner = require("portscanner"),
    Promise = require("bluebird"),
    runner = require(path.resolve(__dirname, "runner")),
    server = require(path.resolve(__dirname, "server"));

function awaitServer() {
    return new Promise(function (resolve, reject) {
        portscanner.checkPortStatus(9876, "127.0.0.1", function (err, status) {
            if (err) {
                reject(err);
            } else if ("open" === status) {
                resolve();
            } else {
                awaitServer().then(resolve).catch(reject);
            }
        });
    });
}

module.exports = function (config, pckgPromise, gulp) {
    var configuredRunner = runner(config, pckgPromise, gulp),
        configuredServer = server(config, pckgPromise, gulp);

    return function () {
        return new Promise(function (resolve, reject) {
            configuredServer().then(resolve).catch(reject);
            awaitServer().then(configuredRunner).catch(reject);
        });
    };
};

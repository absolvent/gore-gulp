/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var express = require("express"),
    pckgPublicPath = require("../../pckg/publicPath"),
    Promise = require("bluebird"),
    webpack = require("webpack"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware");

function hotModuleReplacementServer(config, pckg, entries, webpackConfig) {
    var app = express(),
        compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        "noInfo": true,
        "publicPath": pckgPublicPath(pckg)
    }));
    app.use(webpackHotMiddleware(compiler));

    return new Promise(function (resolve, reject) {
        var server = app.listen(3000, "localhost", function (err) {
            if (err) {
                reject(err);

                return;
            }

            resolve(server);
        });
    });
}

module.exports = hotModuleReplacementServer;

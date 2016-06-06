/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const development = require("./config/babel/web/development");
const production = require("./config/babel/web/production");
const Promise = require("bluebird");
const webpack = require("webpack");

module.exports = function (inp, callback) {
    const webpackConfigPromise = "production" === inp.variant ? (
        production(inp.config, inp.pckg, inp.entries)
    ) : (
        development(inp.config, inp.pckg, inp.entries)
    );

    webpackConfigPromise.then(webpackConfig => {
        return Promise.fromCallback(webpackCallback => {
            webpack(webpackConfig, err => {
                webpackCallback(err, webpackConfig);
            });
        });
    }).asCallback(function (err, data) {
        if (err) {
            callback(err.toString(), data);
        } else {
            callback(null, data);
        }
    });
};

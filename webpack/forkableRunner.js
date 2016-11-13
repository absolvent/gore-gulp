/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const babel = require('babel-core');
const development = require('./config/babel/web/development');
const fs = require('fs');
const head = require('lodash/head');
const production = require('./config/babel/web/production');
const Promise = require('bluebird');
const webpack = require('webpack');
const webpackGetOutputFilename = require('./webpackGetOutputFilename');

module.exports = function runWebpack(inp, callback) {
  const webpackConfigPromise = inp.variant === 'production' ? (
    production(inp.config, inp.pckg, inp.entries)
  ) : (
    development(inp.config, inp.pckg, inp.entries)
  );

  webpackConfigPromise.then(webpackConfig => (
    Promise.fromCallback(webpackCallback => {
      webpack(webpackConfig, err => webpackCallback(err, webpackConfig));
    })
  )).then(webpackConfig => {
    if (inp.variant !== 'production') {
      return webpackConfig;
    }

    const entryPointName = head(Object.keys(webpackConfig.entry));
    const outputFilename = webpackGetOutputFilename(webpackConfig, entryPointName);

    return Promise.fromCallback(babelCallback => {
      babel.transformFile(outputFilename, {
        plugins: webpackConfig.babel.plugins,
        presets: webpackConfig.babel.presets,
      }, babelCallback);
    }).then(babelResult => {
      return Promise.fromCallback(fsCallback => {
        fs.writeFile(outputFilename, babelResult.code, fsCallback);
      });
    }).then(() => {
      return webpackConfig;
    });
  }).asCallback((err, data) => {
    if (err) {
      callback(err.toString(), data);
    } else {
      callback(null, data);
    }
  });
};

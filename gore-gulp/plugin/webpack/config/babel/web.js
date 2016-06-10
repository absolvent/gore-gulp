/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const babel = require('../babel');
const merge = require('lodash/merge');
const path = require('path');
const webpack = require('webpack');

function normalizeProvidePaths(providePaths) {
  if (!providePaths) {
    return {};
  }

  return providePaths;
}

function web(config, pckg, entries) {
  return babel(config, pckg).then(function (babelConfig) {
    return merge({}, babelConfig, {
      entry: entries,
      output: {
        filename: `${pckg.name}.[name].min.js`,
        path: path.resolve(config.baseDir, pckg.directories.dist),
      },
      plugins: babelConfig.plugins.concat([
        new webpack.ProvidePlugin(normalizeProvidePaths(pckg.provide)),
      ]),
    });
  });
}

module.exports = web;

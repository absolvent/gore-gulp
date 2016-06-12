/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const eslint = require('lookly-preset-eslint');
const getGlobPattern = require('../getGlobPattern');
const keys = require('lodash/keys');

module.exports = function eslintPlugin(config, pckg) {
  return eslint(getGlobPattern(config, pckg), {
    configFile: require.resolve('lookly-preset-eslint/eslint'),
    globals: keys(pckg.provide),
    silent: config.silent,
  });
};

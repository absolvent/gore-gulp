/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const awaitGlobPattern = require('../awaitGlobPattern');
const eslint = require('lookly-preset-eslint');
const keys = require('lodash/keys');
const Promise = require('bluebird');

module.exports = function (config, pckgPromise) {
  const initPromises = [
    awaitGlobPattern(config, pckgPromise),
    pckgPromise,
  ];

  return Promise.all(initPromises).spread(function (globPattern, pckg) {
    return eslint(globPattern, {
      configFile: require.resolve('lookly-preset-eslint/eslint'),
      globals: keys(pckg.provide),
    });
  });
};

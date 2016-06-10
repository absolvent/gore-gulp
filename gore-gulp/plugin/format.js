/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const esformatter = require('lookly-preset-esformatter');
const awaitGlobPattern = require('../awaitGlobPattern');

module.exports = function (config, pckgPromise) {
  return function () {
    return awaitGlobPattern(config, pckgPromise).then(function (globPattern) {
      return esformatter.formatGlob(globPattern);
    });
  };
};

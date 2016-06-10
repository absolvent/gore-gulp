/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const globSpread = require('../globSpread');
const minimist = require('minimist');
const mocha = require('lookly-preset-mocha');
const path = require('path');

module.exports = function (config, pckgPromise) {
  return function () {
    return pckgPromise.then(function (pckg) {
      const options = minimist(process.argv.slice(2), {
        string: 'glob',
        default: {
          glob: path.resolve(config.baseDir, globSpread(pckg.directories.lib), '**/*.test.js'),
        },
      });

      return mocha(options.glob);
    });
  };
};

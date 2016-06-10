/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const globSpread = require('./globSpread');
const minimist = require('minimist');
const path = require('path');

function testPluginCliOptions(config, pckg, argv) {
  return minimist(argv, {
    string: 'glob',
    default: {
      glob: path.resolve(config.baseDir, globSpread(pckg.directories.lib), '**/*.test.js'),
    },
  });
}

module.exports = testPluginCliOptions;

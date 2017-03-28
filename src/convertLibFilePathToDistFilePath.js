/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const globSpread = require('./globSpread');
const path = require('path');

function convertLibFilePathToDistFilePath(config, pckg, filename) {
  const dist = path.resolve(config.baseDir, globSpread(pckg.directories.dist || 'dist'));
  const lib = path.resolve(config.baseDir, globSpread(pckg.directories.lib));
  return path.resolve(dist, path.relative(lib, filename));
}

module.exports = convertLibFilePathToDistFilePath;

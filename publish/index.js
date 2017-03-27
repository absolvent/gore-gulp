/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const babelConfig = require('lookly-preset-babel');
const getGlobPattern = require('../src/getGlobPattern');
const glob = require('ultra-glob');
const babel = require('babel-core');
const fs = require('fs');
const Promise = require('bluebird');

function publish(pattern, options) {
  return glob(pattern).then(files =>
    Promise.all(
      files.map(filename =>
        Promise.fromCallback(cb =>
          babel.transformFile(
            filename,
            options,
            cb
          )).then(result => Promise.fromCallback(cb => fs.writeFile(filename, result, cb))))
    ));
}

module.exports = function publishPlugin(config, pckg) {
  return publish(getGlobPattern(config, pckg), babelConfig());
};

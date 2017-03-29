/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const getBabelConfig = require('lookly-preset-babel');
const getGlobPattern = require('../src/getGlobPattern');
const glob = require('ultra-glob');
const babel = require('babel-core');
const fs = require('fs');
const Promise = require('bluebird');
const convertLibFilePathToDistFilePath = require('../src/convertLibFilePathToDistFilePath');
const path = require('path');

const mkdirp = require('mkdirp');

function publish(pattern, babelConfig, config, pckg) {
  return glob(pattern).then(files => Promise.all(
    files.map(fileName => Promise.fromCallback(cb =>
      babel.transformFile(fileName, babelConfig, cb))
      .then(result => {
        const newFileName = convertLibFilePathToDistFilePath(config, pckg, fileName);
        return Promise.fromCallback(cb => {
          mkdirp(path.dirname(newFileName), () => {
            fs.writeFile(newFileName, result.code, cb);
          });
        });
      }
    ))
  ));
}

module.exports = function publishPlugin(config, pckg) {
  const babelConfig = getBabelConfig();
  return publish(getGlobPattern(config, pckg), babelConfig, config, pckg);
};

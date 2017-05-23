/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const libDirs = require('../../../../src/pckg/libDirs');
const map = require('lodash/map');
const merge = require('lodash/merge');
const path = require('path');
const web = require('../web');
const webpack = require('webpack');

function development(config, pckg, entries) {
  return web(config, pckg, entries).then(webConfig => {
    const webDevConfig = merge({}, webConfig, {
      plugins: [
        new webpack.LoaderOptionsPlugin({
          debug: true
        })
      ],
      devtool: config.developmentDevtool || 'none',
    });

    webDevConfig.module.rules[0].include = map(libDirs(pckg), libDir => path.resolve(config.baseDir, libDir));

    return webDevConfig;
  });
}

module.exports = development;

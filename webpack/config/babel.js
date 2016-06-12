/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ecmaScriptFileExtensions = require('../../src/pckg/ecmaScriptFileExtensions');
const gorePckg = require('../../package.json');
const isArray = require('lodash/isArray');
const libDirs = require('../../src/pckg/libDirs');
const map = require('lodash/map');
const merge = require('lodash/merge');
const os = require('os');
const path = require('path');
const Promise = require('bluebird');

function normalizeAliasPaths(config, pckg) {
  const alias = {};

  if (!isArray(pckg.directories.lib)) {
    alias[pckg.name] = pckg.directories.lib;
  }

  return merge(alias, pckg.alias);
}

function babel(config, pckg) {
  const cacheIdentifier = gorePckg.name + gorePckg.version + pckg.name + pckg.version;
  const cacheDirectory = path.resolve(os.tmpdir(), cacheIdentifier);

  return Promise.resolve(merge({}, {
    bail: true,
    externals: pckg.externals,
    module: {
      loaders: [
        {
          include: map(libDirs(pckg), libDir => path.resolve(config.baseDir, libDir)),
          test: /\.jsx?$/,
          loader: path.resolve(__dirname, '..', 'babelLoader'),
          query: {
            cacheDirectory,
            cacheIdentifier,
          },
        },
      ],
    },
    plugins: [],
    resolve: {
      alias: normalizeAliasPaths(config, pckg),
      extensions: ecmaScriptFileExtensions(pckg),
      root: config.baseDir,
    },
  }));
}

module.exports = babel;

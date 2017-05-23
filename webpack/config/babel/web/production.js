/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const merge = require('lodash/merge');
const web = require('../web');
const webpack = require('webpack');

function production(config, pckg, entries) {
  return web(config, pckg, entries).then(webConfig => (
    merge({}, webConfig, {
      devtool: config.productionDevtool || 'none',
      plugins: webConfig.plugins.concat([
          new webpack.LoaderOptionsPlugin({
            minimize: true
          }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: true
          }
        }),
        new webpack.LoaderOptionsPlugin({
          debug: true
        }),
      ]),
    })
  ));
}

module.exports = production;

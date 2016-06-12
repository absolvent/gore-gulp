/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ava = require('lookly-preset-ava');

module.exports = function avaPlugin(config) {
  return ava(config.glob, {
    silent: config.silent,
  });
};

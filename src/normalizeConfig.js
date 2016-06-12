/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const identity = require('lodash/identity');
const merge = require('lodash/merge');

function normalizeConfigObject(config) {
  return merge({
    override: identity,
    useAva: false,
  }, config);
}

function normalizeConfig(config) {
  if (typeof config === 'string') {
    return normalizeConfigObject({
      baseDir: config,
    });
  }

  return normalizeConfigObject(config);
}

module.exports = normalizeConfig;

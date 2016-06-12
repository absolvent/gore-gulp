/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const normalizeConfig = require('../normalizeConfig');
const test = require('lookly-preset-ava/test');

test('should normalize basedir to object', t => {
  const normalizedConfig = normalizeConfig(__dirname);

  t.is(normalizedConfig.baseDir, __dirname);
});

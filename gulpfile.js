/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const pckg = require(path.resolve(__dirname, 'package.json'));
const gg = require('./src');
const gulp = require('gulp');

const gore = gg({
  baseDir: __dirname,
  useAva: true,
}).setup(gulp);

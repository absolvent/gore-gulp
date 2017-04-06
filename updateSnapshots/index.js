/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ava = require('lookly-preset-ava');

module.exports = function updateSnapshotsPlugin(config) {
  console.log(config.override.name);
  if (!config.useAva) {
    throw new Error('"update-snapshots" works only with Ava! Check "useAva" option\n');
  }
  return ava(config.glob, {
    updateSnapshots: true,
  });
};

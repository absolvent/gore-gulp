/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const MODULE_BUILD_ERROR_MESSAGE_REGEXP = /^ModuleBuildError: Module build failed: ReferenceError: Unknown plugin "([a-zA-Z\-]+)"/;

class MissingBabelPluginErrorHandle {
  constructor(err) {
    this.err = err;
  }

  createMissingPluginMessage() {
    return new Promise(resolve => {
      const missingPluginName = 'babel-plugin-'+this.err.message.match(MODULE_BUILD_ERROR_MESSAGE_REGEXP)[1];

      resolve(
        'Some of your dependencies require "'+missingPluginName+'" to build.'
        + ' Please add '+missingPluginName+' to "devDependencies" in your'
        + ' package.json to continue.'
      );
    });
  }
}

MissingBabelPluginErrorHandle.isMissingPluginError = function (err) {
  if (!err || !err.message) {
    return false;
  }

  return MODULE_BUILD_ERROR_MESSAGE_REGEXP.test(err.message);
}

module.exports = MissingBabelPluginErrorHandle;

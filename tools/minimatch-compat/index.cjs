'use strict';

/**
 * The interface of minimatch 3 and 10 on top of minimatch 11, which fixes
 * GHSA-g3hv-75wg-m249. Two things changed in 11 that older dependents rely on:
 *
 * - minimatch 3 exports the match function itself (`require('minimatch')(path, glob)`);
 *   11 exports an object with a `minimatch` property.
 * - minimatch 10 has a public `Minimatch#matchOne(file, pattern, partial)`; 11 made it
 *   private. TypeDoc calls it for every row of `Minimatch#set` and only needs to know
 *   whether any row matches, which `match(path, partial)` answers for the whole set.
 */
const modern = require('minimatch');

class Minimatch extends modern.Minimatch {
  /**
   * @param {string[] | string} file - Path segments, or a path.
   * @param {unknown} _pattern - One row of `this.set`; `match()` checks every row.
   * @param {boolean} [partial] - Whether a partial path may match a longer pattern.
   * @returns {boolean} Whether the path matches.
   */
  matchOne(file, _pattern, partial = false) {
    return this.match(Array.isArray(file) ? file.join('/') : file, partial);
  }
}

/** minimatch 3 style: the export is the match function. */
function minimatch(path, pattern, options) {
  return modern.minimatch(path, pattern, options);
}

Object.assign(minimatch, modern, { minimatch, Minimatch, default: minimatch });

module.exports = minimatch;

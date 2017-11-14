'use strict';
/**
 * Test file for plop sub generator
 */
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
// Const fs = require('fs-extra');
const path = require('path');

describe('nodex:pwa', () => {
  test('creates pwa enable app', () => {
    return helpers
      .run(require.resolve('../generators/pwa'))
      .withPrompts({
        cacheName: 'whatever-cache',
        cacheDescription: 'Whatever cache',
        startUrl: 'index.html?start=pwa',
        displayStyle: 'standalone',
        orientation: 'portrait',
        setColorAttr: false
      })
      .then(() => {
        assert.file(path.join('app', 'manifest.json'));
        assert.file(path.join('app', 'scripts', 'service-worker.js'));
      });
  });
});

'use strict';
/**
 * Test file for plop sub generator
 */
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const path = require('path');

describe('nodex:plop', () => {
  test('creates plopfile.js files, and package.json contain plop reference', () => {
    return helpers
      .run(require.resolve('../generators/plop'))
      .inTmpDir(function(dir) {
        const done = this.async(); // `this` is the RunContext object
        fs.copySync(path.resolve(path.join(__dirname, '..', 'package.json')), dir, done);
      })
      .then(() => {
        assert.file('plopfile.js');
        assert.fileContent('package.json', '"plop": "^1.9.0"');
        assert.fileContent('package.json', 'node ./node_modules/plop/src/plop.js');
      });
  });
});

describe('nodex:plop --lang=cn', () => {
  test('Create plopfile.js with the Chinese options', () => {
    return helpers
      .run(require.resolve('../generators/plop'))
      .withOptions({ lang: 'cn' })
      .inTmpDir(function(dir) {
        const done = this.async(); // `this` is the RunContext object
        fs.copySync(path.resolve(path.join(__dirname, '..', 'package.json')), dir, done);
      })
      .then(() => {
        assert.file('plopfile.js');

        assert.fileContent('plopfile.js', '你的答案是');
        assert.fileContent('plopfile.js', '这是一个示例');
      });
  });
});

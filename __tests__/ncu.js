'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const rootPkg = require('../package.json');

describe('nodex:ncu', () => {
  beforeEach(() => {});

  it.skip('setup ncu in project', () => {
    return helpers.run(require.resolve('../generators/ncu')).then(() => {
      assert.jsonFileContent('package.json', {
        devDependencies: {
          'npm-check-updates': rootPkg.devDependencies['npm-check-updates']
        }
        /*
        Scripts: {
          prepublishOnly: 'yarn yo nodex:ncu'
        } */
      });
    });
  });
});

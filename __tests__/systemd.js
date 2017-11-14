'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('nodex:nginx', () => {
  const answers = {
    appName: 'start up',
    description: 'systemd startup script for start up',
    environment: 'NODE_ENV=test',
    user: 'tester',
    nodePath: '/usr/bin/node',
    appPath: '/path/to/app/index.js'
  };

  it('should create a systemd startup script', () => {
    return helpers
      .run(require.resolve('../generators/systemd'))
      .withPrompts(answers)
      .then(() => {
        assert.file('start-up.conf');
        assert.fileContent('start-up.conf', /systemd startup script for start up/);
        assert.fileContent('start-up.conf', /NODE_ENV=test/);
      });
  });

  it('respect --generate-into option as the root of the scaffolding', () => {
    return helpers
      .run(require.resolve('../generators/systemd'))
      .withPrompts(answers)
      .withOptions({ generateInto: 'other' })
      .then(() => {
        assert.file('other/start-up.conf');
      });
  });
});

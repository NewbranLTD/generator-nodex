'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('nodex:systemd', () => {
  const answers = {
    appName: 'start up',
    description: 'systemd startup script for start up',
    environment: 'NODE_ENV=test',
    user: 'tester',
    group: 'tester',
    nodePath: '/usr/bin/node',
    appPath: '/path/to/app/index.js'
  };

  const startFileName = 'start-up.service';

  it('should create a systemd startup script', () => {
    return helpers
      .run(require.resolve('../generators/systemd'))
      .withPrompts(answers)
      .then(() => {
        assert.file(startFileName);
        assert.fileContent(startFileName, /systemd startup script for start up/);
        assert.fileContent(startFileName, /NODE_ENV=test/);
      });
  });

  it('respect --generate-into option as the root of the scaffolding', () => {
    return helpers
      .run(require.resolve('../generators/systemd'))
      .withPrompts(answers)
      .withOptions({ generateInto: 'other' })
      .then(() => {
        assert.file(`other/${startFileName}`);
      });
  });
});

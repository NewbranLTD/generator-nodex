'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('nodex:webhook', () => {
  const answers = {
    webPath: '/webhook',
    secret: '1234567890',
    cwd: '/home/to/directory',
    port: 8989,
    branch: 'refs/heads/master'
  };

  const startFileName = 'webhook.js';

  it('should create a webhook script', () => {
    return helpers
      .run(require.resolve('../generators/webhook'))
      .withPrompts(answers)
      .then(() => {
        assert.file(startFileName);
      });
  });
});

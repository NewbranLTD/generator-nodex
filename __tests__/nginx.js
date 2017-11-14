'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('nodex:nginx', () => {
  const answers = {
    listenPortNumber: 80,
    serverName: '127.0.0.1',
    localhostName: 'http://localhost',
    localhostPort: 3000,
    wwwDomain: false
  };

  it('should create a nginx config', () => {
    return helpers
      .run(require.resolve('../generators/nginx'))
      .withPrompts(answers)
      .then(() => {
        assert.file('nginx.conf');
        assert.fileContent('nginx.conf', /server_name 127.0.0.1;/);
        assert.fileContent('nginx.conf', /listen 80;/);
      });
  });

  it('respect --generate-into option as the root of the scaffolding', () => {
    return helpers
      .run(require.resolve('../generators/nginx'))
      .withPrompts(answers)
      .withOptions({ generateInto: 'other' })
      .then(() => {
        assert.file('other/nginx.conf');
      });
  });
});

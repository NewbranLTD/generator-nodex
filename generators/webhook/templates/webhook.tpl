'use strict';
/**
 * git-webhook-ci
 */
const gitWebhookCi = require('git-webhook-ci');
const config = {
  secret: '<%= secret %>',
  provider: '<%= provider %>',
  path: '<%= webPath %>',
  dir: '<%= cwd %>',
  port: <%= port %>,
  branch: '<%= branch %>',
  cmd: '<%= cmd %>'
};
// Re-export the server instace to use elsewhere
module.exports = gitWebhookCi(config);

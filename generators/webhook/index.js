'use strict';
/**
 * Simple mini generator to create a systemd startup file
 */
const Generator = require('../../lib/index.js');
const _ = require('lodash');
const chalk = require('chalk');
const version = '^0.7.1';
const validate = input => input && input !== '';
const fake = {
  name: 'webhook'
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // Default opts
    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'generateInto'
    });
    this.addPackageFailed = false;
  }

  initializing() {
    // Just guessing
    this.props.appPath = this.destinationPath();
    this.package = this.fs.readJSON(this.destinationPath('package.json'));
    this.props.scriptName = this._toDash((this.package || fake).name);
  }

  prompting() {
    const prompts = [
      {
        name: 'webPath',
        message: 'The path to your webhook url (excluding the domain name)',
        default: '/webhook',
        validate: validate
      },
      {
        name: 'secret',
        message: 'The secret you provide to github when you setup your webhook',
        validate: validate
      },
      {
        name: 'cwd',
        message: 'The directory where you execute this script',
        default: this.props.appPath,
        validate: validate
      },
      {
        name: 'port',
        message: 'The port number where you run this webhook',
        default: 8080,
        validate: validate
      },
      {
        name: 'branch',
        message: 'Which branch you want to excute when webhook callback',
        default: 'refs/heads/master',
        validate: validate
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = _.extend(this.props, props);
    });
  }

  writing() {
    try {
      this.package.dependencies = _.extend({}, this.package.dependencies, {
        'github-webhook-handler': version
      });
      this.fs.writeJSON(this.destinationPath('package.json'), this.package);
    } catch (e) {
      this.addPackageFailed = true;
    }
    const fileName = [this.props.scriptName, 'js'].join('.');
    this._copyTpl('webhook.tpl', [this.options.generateInto, fileName], this.props);
  }

  end() {
    if (this.addPackageFailed && process.env.NODE_ENV !== 'test') {
      this.log(chalk.red(this.t('Fail to add new package to your package.json')));
      this.log(chalk.red(this.t('Please add github-webhook-handler manually')));
    }
  }
};

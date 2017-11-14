'use strict';
/**
 * Simple mini generator to create a systemd startup file
 */
const Generator = require('../../lib/index.js');
const _ = require('lodash');
const chalk = require('chalk');
const username = require('username');

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
  }

  /**
   * Run couple command to determine some of the system variables
   */
  initializing() {
    this.props.nodePath = '/usr/bin/node';
    // See if we could find a package.json file from where we run
    try {
      this.props.appName = this.fs.readJSON(this.destinationPath('package.json')).name;
    } catch (e) {
      this.props.appName = 'node-systemd-startup';
    }
    // Get the current system login username
    username().then(uname => {
      this.props.user = uname || 'root';
    });
    // Just guessing
    this.props.appPath = this.destinationPath('index.js');
  }

  /**
   * Ask the required parameter to setup the nginx config
   */
  prompting() {
    const prompts = [
      {
        name: 'appName',
        message: 'The name of your systemd service (your app name)',
        default: this.props.appName,
        validate: input => input && input !== ''
      },
      {
        name: 'description',
        message: 'Provide a description of this systemd service',
        default: 'Start up script for node app',
        validate: input => input && input !== ''
      },
      {
        name: 'environment',
        message: 'Provide a NODE_ENV variable to your app',
        default: 'NODE_ENV=production'
      },
      {
        name: 'user',
        message: 'The system user going to run this node app',
        default: this.props.user,
        validate: input => input && input !== ''
      },
      {
        name: 'nodePath',
        message: 'The path to your node installation on this system',
        default: this.props.nodePath,
        validate: input => input && input !== ''
      },
      {
        name: 'appPath',
        message: 'The path to the start up script',
        default: this.props.appPath,
        validate: input => input && input !== ''
      }
    ];
    return this.prompt(prompts).then(props => {
      props.appName = this._toDash(props.appName);
      this.props = _.extend(this.props, props);
    });
  }

  /**
   * Create file
   */
  writing() {
    this._copyTpl(
      'systemd.tpl',
      [this.options.generateInto, [this.props.appName, 'conf'].join('.')],
      this.props
    );
  }

  /**
   * Instruction at the end
   */
  end() {
    if (process.env.NODE_ENV !== 'test') {
      const div = chalk.yellow('+---------------------------------------------------+');
      this.log(div);
      this.log(chalk.yellow(this.t('Please make sure you copy this file into the')));
      this.log(chalk.yellow(this.t('/etc/systemd/system folder (not symbolic link!)')));
      this.log(chalk.yellow(this.t('Then execute the following commands')));
      this.log(div);
      this.log(chalk.cyan('sudo systemctl daemon-reload'));
      this.log(chalk.cyan('sudo systemctl start ' + this.props.appName));
      this.log(div);
      this.log(
        chalk.yellow(this.t('Your app should start automatically when server start'))
      );
      this.log(div);
    }
  }
};

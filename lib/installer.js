/* eslint no-useless-constructor:0,  */
/**
 * no-mixed-requires one-var
 * Perform some low level check to determine the installer
 * @TODO all the name change need to named it with the class name
 */
const Generator = require('./translate.js');
const commandExist = require('command-exists').sync;
const spawn = require('child_process').spawn;
const _ = require('lodash');
const path = require('path');
const when = require('when');
const chalk = require('chalk');
const githubUsername = require('github-username');
const askName = require('inquirer-npm-name');
const isTesting = process.env.NODE_ENV === 'test';
// Export class
module.exports = class extends Generator {
  /*
  Constructor(args, opts) {
    super(args, opts);
  }
  */
  get moduleNamePrompt() {
    return {
      name: 'name',
      message: 'moduleName',
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate(str) {
        return str.length > 0;
      }
    };
  }

  /**
   * @param {string} cmd command to execute
   * @param {array} args array to argument
   * @param {objec} options to pass to the spawn method
   * @return {promise} when instance
   */
  _runSpawnCmd(cmd, args = [], options = {}) {
    return when.promise(resolver => {
      const es = spawn(cmd, args, options);
      es.stdout.on('data', data => {
        if (!isTesting) {
          this.log(chalk.white(`${data}`));
        }
      });
      es.stderr.on('data', data => {
        if (!isTesting) {
          this.log(chalk.red(`${data}`));
        }
      });
      // Even when there is an error we are not going reject it
      es.on('close', code => {
        resolver(code);
      });
    });
  }

  /**
   * Run checks on both the installer
   * @return {object} whether the installer installed or not
   */
  _runCheckInstalledInstaller() {
    const yarnInstalled = commandExist('yarn');
    const cnpmInstalled = commandExist('cnpm');
    const newFeatures = { yarnInstalled, cnpmInstalled };
    this.props = _.merge(this.props, newFeatures);
    if (this.lang === 'cn' && !cnpmInstalled) {
      this.log(chalk.yellow(this.t('SHOULD_USE_CNPM')));
    }
    return newFeatures;
  }

  /**
   * Check if this generator actually installed
   * @TODO should we use the config.getAll() then populate the props again instead
   */
  _checkIfAlreadyInstalled() {
    // Just checking if lang is presented
    return this.config.get('lang');
  }

  /**
   * Get available installers
   * @return {promise} installers array
   */
  _getInstallerChoices() {
    const features = this._runCheckInstalledInstaller();
    const installChoices = [
      {
        name: 'npm',
        value: 'npm'
      }
    ];
    if (features.yarnInstalled) {
      installChoices.push({
        name: 'yarn',
        value: 'yarn'
      });
    }
    if (this.lang === 'cn' && features.cnpmInstalled) {
      installChoices.push({
        name: 'cnpm',
        value: 'cnpm'
      });
    }
    return installChoices;
  }

  /**
   * Just wrap the the check method together
   */
  _alreadyHasName() {
    if ((this.pkg && this.pkg.name) || (this.options && this.options.name)) {
      this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      return Promise.resolve();
    }
    return false;
  }

  /**
   * For legacy code using the yarnInstall npmInstall
   */
  _translateInstaller(installer) {
    switch (installer) {
      case 'yarnInstall':
        return 'yarn';
      case 'npmInstall':
        return 'npm';
      default:
        return installer;
    }
  }

  /**
   * Actually running the installer - just overload the existing one
   * @return {object} spawn instance
   */
  installerInstallDependencies() {
    const done = this.async();
    if (isTesting) {
      return done(); // Just exit don't do anything
    }
    // Sometime it might call this again after the setup is done
    // so we query if there is a yo-rc.json first
    let installer = this.config.get('installer') || this.props.installer || 'npm';
    installer = this._translateInstaller(installer);
    this.log(chalk.yellow(this.t('runningInstaller', { installer })));
    // We are not using the stock installer instead we run from command line
    return this._runSpawnCmd(installer, ['install']).then(result => done(result));
  }

  /**
   * If yarn install or they are using cn in the lang option
   */
  installerAskForInstaller() {
    const choices = this._getInstallerChoices();
    if (choices.length > 1 && !this.options['skip-nodex-install']) {
      return this.prompt({
        type: 'list',
        choices: choices,
        name: 'installer',
        message: 'whichInstallerToUse',
        default: this.props.cnpmInstalled ? 'cnpm' : 'npm'
      }).then(answer => {
        this.props.installer = answer.installer;
        return this.props;
      });
    }
    return Promise.resolve();
  }

  /**
   * Ask the user if they want to build web app or modules
   * If they answer modules then we will use the askName method
   */
  installerAskForAppType() {
    return this.prompt({
      type: 'list',
      name: 'appType',
      message: 'What are you going to create',
      choices: [
        {
          name: this.t('Web application'),
          value: 'webapp'
        },
        {
          name: this.t('Module'),
          value: 'module'
        }
      ]
    }).then(answer => {
      this.props.appType = answer.appType;
    });
  }

  /**
   * This is taken out from the original app/index only ask for the name
   * or make a suggestion based on the dir currently in
   */
  installerAskForModuleName() {
    const result = this._alreadyHasName();
    if (result !== false) {
      return result;
    }
    return askName(this.moduleNamePrompt, this).then(answer => {
      this.props.name = answer.name;
    });
  }

  /**
   * This will not check npm for existing name
   */
  installerAskForWebAppName() {
    const result = this._alreadyHasName();
    if (result !== false) {
      return result;
    }
    return this.prompt(this.moduleNamePrompt).then(answer => {
      this.props.name = answer.name;
    });
  }

  /**
   * @TODO in the future when it's cn then ask for the gitee account name instead?
   * or we could ask them which git they want to use etc
   */
  installerAskForGithubAccount() {
    if (this.options.githubAccount) {
      this.props.githubAccount = this.options.githubAccount;
      return Promise.resolve();
    }
    return githubUsername(this.props.authorEmail)
      .then(username => username, () => '')
      .then(username => {
        return this.prompt({
          name: 'githubAccount',
          message: 'githubAccount',
          default: username
        }).then(prompt => {
          this.props.githubAccount = prompt.githubAccount;
        });
      });
  }

  /**
   * @TODO expand support to gitlab as well
   */
  installerAskWhatTypeOfGit() {
    return this.prompts({
      type: 'list',
      name: 'gitAccountType',
      choices: ['github', 'gitlab', 'gitee'],
      message: 'What git account you are going to use?'
    }).then(answer => {
      this.props.gitAccountType = answer.gitAccountType;
    });
  }

  /**
   * If they want to setup a doc - if they are using github
   */
  installerAskIfTheyWantPage() {
    return this.prompts({
      type: 'confirm',
      name: 'githubPage',
      message: 'Do you want to setup a github page folder?',
      default: this.props.appType === 'module'
    }).then(answer => {
      this.props.githubPage = answer.githubPage;
    });
  }

  /**
   * Create an nginx config file
   */
  installerAskForNginxOption() {
    if (this.options['skip-nodex-nginx']) {
      return Promise.resolve();
    }
    return this.prompt({
      type: 'confirm',
      name: 'setupNginx',
      message: 'Do you want to create a nginx proxy config file?',
      default: false
    }).then(prompt => {
      this.props.setupNginx = prompt.setupNginx;
    });
  }
};

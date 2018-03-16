'use strict';
/**
 * Due to this generator has a lot extra functionality
 * Create this just to allow the user to see how many funcitons
 * and their usage
 */
const chalk = require('chalk');
const path = require('path');
const glob = require('glob');
const Generator = require('../../lib');

module.exports = class extends Generator {
  // Start
  initializing() {
    return new Promise((resolver, rejecter) => {
      glob(path.join(__dirname, '..', '*'), (err, files) => {
        if (err) {
          return rejecter(new Error(err));
        }
        const dirs = files
          .map(f => {
            const parts = f.split('/');
            return parts[parts.length - 1];
          })
          .filter(d => d !== 'app' && d !== 'help');
        dirs.push('EXIT');
        this.props.commands = dirs;
        resolver(dirs);
      });
    });
  }

  // Question time
  prompting() {
    return this.prompt({
      type: 'list',
      choices: this.props.commands,
      message: 'Pick your sub generator',
      name: 'sub'
    }).then(answer => {
      if (answer.sub !== 'EXIT') {
        this.props.sub = answer.sub;
      }
    });
  }

  // Running it
  writing() {
    return new Promise(resolver => {
      if (this.props.sub) {
        return this.log('Run:', chalk.yellow(`yo nodex:${this.props.sub}`));
      }
      resolver(true);
    });
  }

  // End
  end() {
    this.log('Help exited');
  }
};

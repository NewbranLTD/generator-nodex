/**
 * Due to this generator has a lot extra functionality
 * Create this just to allow the user to see how many funcitons
 * and their usage
 */
'use strict';

const path = require('path');
const Generator = require('../../lib');
const glob = require('glob');

module.exports = class extends Generator {
  initializing() {
    glob(path.join(__dirname, '..'), (err, files) => {
      console.log(err);
      console.log(files);
    });
  }

  end() {
    this.log('Help exited');
  }
};

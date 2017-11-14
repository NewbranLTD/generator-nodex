/**
 * Sub generator to pick up a config file from the user local app folder
 * then create new generator based on it.
 * options --yofile=/path/to/the/file.js
 * or just put a yofile.js on the level root
 */
const Generator = require('../../lib/index.js');
const chalk = require('chalk');
// Export
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // Now check the installation for the file
    this.option('yofile', {
      type: String,
      required: true,
      default: './yofile.js',
      desc: 'yofile'
    });

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'generateInto'
    });
  }

  /**
    The yofile.js basically

    export one function
    // same that you can pass the args and opts
    module.exports = function(args, opts) {
      return {
        prompt: [

        ],
        action: (answers) => {

        }
      }
    }
  **/

  /**
   * first we need to check if they pass --youfile=/path/to/file
   * if not then we check if the current directory has a yofile.js
   */
  initializing() {
    this.log(chalk.red('THIS IS CURRENTLY UNDER DEVELOPMENT'));
  }
};

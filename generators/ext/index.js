/**
 * sub generator to pick up a config file from the user local app folder
 * then create new generator based on it.
 */
const Generator = require('../../lib/index.js');


module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    // now check the installation for the file
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
   * first we need to check if they pass --youfile=/path/to/file
   * if not then we check if the current directory has a yofile.js
   */
  initializing() {

  }

  

}

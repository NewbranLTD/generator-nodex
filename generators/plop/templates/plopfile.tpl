'use strict';

module.exports = function generator(plop) {

  plop.setActionType('customAction', answers => {
    console.log('<%= consoleLog %>', answers.yes ? '<%= yes %>' : '<%= no %>');
  });

  plop.setGenerator('example',  {
    description: '<%= description %>',
    prompts: [
      {
        type: 'confirm',
        name: 'yes',
        message: '<%= message %>',
        default: true
      }
    ],
    actions: [
      {
        type: 'customAction'
      }
    ]
});

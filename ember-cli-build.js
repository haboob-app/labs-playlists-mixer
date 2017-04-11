/*jshint node:true*/
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var env = EmberApp.env();
var isProductionLikeBuild = ['production', 'staging'].indexOf(env) > -1;

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      enabled: true,
      prepend: ''
    }
  });

  if (isProductionLikeBuild) {
    app.options.fingerprint.prepend = 'https://labs.haboob.co/plm/public/';
  }

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import(app.bowerDirectory + '/tether/dist/js/tether.js');
  app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');

  app.import(app.bowerDirectory + '/parsleyjs/dist/parsley.js');
  app.import(app.bowerDirectory + '/parsleyjs/dist/i18n/es.js');
  app.import(app.bowerDirectory + '/parsleyjs/dist/i18n/en.js');

  return app.toTree();
};

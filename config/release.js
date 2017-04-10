/* jshint node:true */
var RSVP = require('rsvp');

// For details on each option run `ember help release`
module.exports = {
  afterPush: function(project, tags) {
    return new RSVP.Promise(function(resolve, reject) {
      console.log('ZOMG, ' + project.name() + ' ' + tags.next + ' RELEASED!!!');
      console.log('deploying to production environment...');
      const
          spawn = require( 'child_process' ).spawn,
          ls = spawn( 'ember', [ 'deploy', 'production', '--activate=true' ] );

      ls.stdout.on( 'data', data => {
          console.log( `ember deploy: ${data}` );
      });

      ls.stderr.on( 'data', data => {
          reject( `stderr: ${data}` );
      });

      ls.on( 'close', code => {
          resolve( `child process exited with code ${code}` );
      });
    });
  }
};

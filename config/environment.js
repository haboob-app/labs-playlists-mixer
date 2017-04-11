/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'labs-playlists-mixer',
    environment: environment,
    rootURL: '/',
    routerRootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {

    },

    torii: {
      sessionServiceName: 'session',
      providers: {
        spotify: {
          apiKey: process.env.API_KEY,
          redirectUri: 'http://localhost:4200/mixer/',
          scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
        }
      }
    },

    i18n: {
        defaultLocale: 'en'
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: process.env.ANALYTICS_ID,
          // Use `analytics_debug.js` in development
          debug: false, //environment === 'development',
          // Use verbose tracing of GA events
          trace: false, //environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development'
        }
      }
    ]
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.torii.providers.spotify.redirectUri = 'https://labs.haboob.co/playlists-mixer/#/mixer/';
    ENV.routerRootURL = '/playlists-mixer/';
    ENV.locationType = 'hash';
  }

  return ENV;
};

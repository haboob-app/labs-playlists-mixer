import Ember from 'ember';
import SpotifyWebApi from "npm:spotify-web-api-node";
import moment from 'moment';

const { RSVP: { Promise } } = Ember;

export default Ember.Route.extend({

  session: Ember.inject.service('session'),

  spotifyApi: new SpotifyWebApi(),

  model () {
    return [{ratio: 1}, {ratio: 1}];
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.setProperties({
      'loading': false,
      'playlists': this.findAllPlayLists(),
      'playlistName': 'Playlist ' + moment(new Date()).format('YYYYMMDD'),
      'isPublic': true,
      'shuffle': true
    });

  },

  findPlayLists(offset) {
    let self = this;
    let client = this.get('spotifyApi');
    client.setAccessToken(this.get('session.currentToken'));
    let filters = {
      limit: 50, //max 50
      offset: offset
    };

    return client.getUserPlaylists(null, filters).then(function(data) {
      let d = data.body;
      if (d) {
        self.get("store").pushPayload("playlist", { playlists: d.items });
      }
      return d;
    },function() {
      return null;
    });
  },

  findAllPlayLists() {
    let self = this;
    let offsets = [];
    return this.findPlayLists(0).then(function(data) {
      if (data) {
        for (var i = data.limit; i < data.total; i+= data.limit) {
          offsets.push(self.findPlayLists(i));
        }
      }
      return Promise.all(offsets).then(function () {
        return self.get("store").peekAll('playlist');
      });
    });
  }

});

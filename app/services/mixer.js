import Ember from 'ember';
import SpotifyWebApi from "npm:spotify-web-api-node";
const { RSVP: { Promise } } = Ember;

export default Ember.Service.extend({
  mergePlaylist: [],
  playlists: [],
  ratios: [],
  spotifyApi: null,
  session: Ember.inject.service('session'),

  init() {
    this._super(...arguments);

    let client = new SpotifyWebApi();
    client.setAccessToken(this.get('session.currentToken'));
    this.set('spotifyApi', client);
  },

  reset(){
    this.set('mergePlaylist', []);
    this.set('playlists', []);
    this.set('ratios', []);
  },

  createMixPlaylist(playListName, isPublic) {
    let client = this.get('spotifyApi');
    let userId = this.get('session.currentUserId');
    let self = this;

    return client.createPlaylist(userId, playListName || "Untitled", { public : isPublic })
    .then(function(data) {
      return data.body.id;
    })
    .then(function(playListId) {
      return self.addMixedTracks(userId, playListId);
    })
    .catch(function() {
      return null;
    });
  },

  addMixedTracks(userId, playListId) {
    let client = this.get('spotifyApi');
    let chunks = this.array_chunk(this.mix().map(item => item.uri), 100);

    let promises = [];

    for (var i = 0; i < chunks.length; i++) {
      promises.push(client.addTracksToPlaylist(userId, playListId, chunks[i]));
    }

    return Promise.all(promises);
  },

  array_chunk(arr, size){
    // initialize vars
    var i,
    j = arr.length,
    tempArray = [];
    // loop through and jump based on size
    for (i=0; i<j; i+=size) {
        // slice chunk of arr and push to tempArray
        tempArray.push(arr.slice(i,i+size));
    }
    // return temp array (chunck)
    return tempArray;
  },

  mix() {
    let ratios = this.get('ratios');
    let maxRatio = Math.max(...ratios);
    let normalizedRatios = ratios.map(item => Math.abs(item - maxRatio) + 1);
    let normalizedPlaylists = this.get('playlists').map(item => item.get('songs'));
    let ratioIndex = 2;
    let emptyA = 0;

    do {
      emptyA = 0;
      for (var j = 0; j < normalizedPlaylists.length; j++) {
        normalizedPlaylists[j] = this.getItem(normalizedPlaylists[j], normalizedRatios[j], ratioIndex);
        if (!normalizedPlaylists[j]) {
          emptyA++;
        }
      }
      ratioIndex = (ratioIndex >= maxRatio) ? 1 : ratioIndex + 1;
    }
    while (emptyA < normalizedPlaylists.length);

    return this.get('mergePlaylist');
  },

  getItem(array, ratio, ratioIndex) {
    if (array && array.length > 0) {
      const [head, ...tail] = array;

      if (head && ratio <= ratioIndex) {
        this.get('mergePlaylist').push(head);
        return tail;
      }
      return array;
    }

    return null;
  },

  addPlaylist(playlist, ratio) {
    let self = this;
    this.get('ratios').push(ratio);
    playlist.set('songs', Ember.A());

    return this.findAllPlayListTracks(playlist)
    .then(function () {
      let songs = playlist.get('songs');
      playlist.set('songs', songs.uniqBy('id'));
      self.get('playlists').push(playlist);
      return playlist;
    });
  },

  findPlayListTracks(playlist, offset) {
    let client = this.get('spotifyApi');
    let filters = {
      fields: 'total, limit, offset, items(added_at.id,track(name,id,uri))',
      limit: 100, // max 100
      offset: offset
    };

    return client.getPlaylistTracks(playlist.get('owner.id'), playlist.get('id'), filters)
    .then(function(data) {
      let d = data.body;
      if (d) {

        playlist.get('songs').pushObjects(Ember.A(d.items.map(function(item) {
          let track = item.track;
          track.addedAt = item.added_at;
          return track;
        })));
      }
      return d;
    },function() {
      return null;
    });
  },

  findAllPlayListTracks(playlist) {
    let self = this;
    let offsets = [];
    return this.findPlayListTracks(playlist, 0).then(function(data) {
      if (data) {
        for (var i = data.limit; i < data.total; i+= data.limit) {
          offsets.push(self.findPlayListTracks(playlist, i));
        }
      }

      return Promise.all(offsets).then(function () {
        return playlist.get('songs');
      });

    }).catch(function () {
      return playlist.get('songs');
    });
  }

});

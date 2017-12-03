import Ember from 'ember';
import SpotifyWebApi from "npm:spotify-web-api-node";
const { RSVP: { Promise } } = Ember;

export default Ember.Service.extend({
  mergePlaylist: [],
  playlists: [],
  ratios: [],
  continuousSongs: [],
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
    this.set('continuousSongs', []);
  },

  createMixPlaylist(playListName, isPublic, shuffle) {
    let client = this.get('spotifyApi');
    let userId = this.get('session.currentUserId');
    let self = this;

    return client.createPlaylist(userId, playListName || "Untitled", { public : isPublic })
    .then(function(data) {
      return data.body.id;
    })
    .then(function(playListId) {
      return self.addMixedTracks(userId, playListId, shuffle);
    });
  },

  addMixedTracks(userId, playListId, shuffle) {
    // remove local tracks
    let mixedTracks = this.mix(shuffle).map(item => item.uri).filter(function(item) {
      return item.indexOf("spotify:track:") === 0; //allow only spotify tracks - not spotify:local: or others
    });

    //split by 100 tracks
    let chunks = this.chunk(mixedTracks, 100);

    let promises = [];
    for (var i = 0; i < chunks.length; i++) {
      promises.push(this.addTracksToPlaylist(userId, playListId, chunks[i]));
    }
    //add tracks serially
    return this.promiseSerial(promises);
  },

  addTracksToPlaylist(userId, playListId, tracks) {
    let client = this.get('spotifyApi');
    return function() {
      return client.addTracksToPlaylist(userId, playListId, tracks);
    };
  },

  promiseSerial(funcs) {
    return funcs.reduce(function (promise, func) {
      return promise.then(function (result) {
        return func().then(Array.prototype.concat.bind(result));
      });
    }, Promise.resolve([]));
  },

  chunk(arr, size){
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

  mix(shuffle) {
    let self = this;
    let ratios = this.get('ratios');
    let continuousSongs = this.get('continuousSongs');
    let maxRatio = Math.max(...ratios);
    let normalizedRatios = ratios.map(item => Math.abs(item - maxRatio) + 1);
    let normalizedPlaylists = this.get('playlists').map(item => shuffle ? self.shuffle(item.get('songs')) : item.get('songs'));

    let ratioIndex = 1;
    let emptyA = 0;

    do {
      emptyA = 0;
      for (var j = 0; j < normalizedPlaylists.length; j++) {
        normalizedPlaylists[j] = this.getItem(normalizedPlaylists[j], normalizedRatios[j], continuousSongs[j], ratioIndex);
        if (!normalizedPlaylists[j]) {
          emptyA++;
        }
      }
      ratioIndex = (ratioIndex >= maxRatio) ? 1 : ratioIndex + 1;
    }
    while (emptyA < normalizedPlaylists.length);

    return this.get('mergePlaylist');
  },

  shuffle(array) {
    let m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },

  getItem(array, ratio, continuousSongs, ratioIndex) {
    if (array && array.length > 0) {
      const [head, ...tail] = array;

      if (head && ratio <= ratioIndex && continuousSongs > 0) {
        this.get('mergePlaylist').push(head);
        return this.getItem(tail, ratio, continuousSongs - 1, ratioIndex);
      }
      return array;
    }

    return null;
  },

  addPlaylist(playlist, ratio, continuous) {
    let self = this;
    this.get('ratios').push(ratio);
    this.get('continuousSongs').push(continuous);
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

    });
  }

});

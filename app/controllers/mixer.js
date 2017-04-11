import Ember from 'ember';
import ENV from "labs-playlists-mixer/config/environment";

const { RSVP: { Promise } } = Ember;

export default Ember.Controller.extend({

  mixer: Ember.inject.service('mixer'),
  rootUrl: ENV.routerRootURL,

  actions: {
    add(){
      let model = this.get('model');
      model.pushObject({ratio: 1});
      this.set('model', model);
      return false;
    },

    remove(index){
      let model = this.get('model');
      if (model.get('length') > 2) {
        model.removeAt(index);
        this.set('model', model);
      }
      return false;
    },

    create(btn) {
      this.send('loading');
      this.set('loading', true);
      let $btn = btn.attr('disabled', 'disabled');
      let model = this.get('model');
      let promises = [];
      let mixer = this.get('mixer');
      let self = this;

      mixer.reset();

      for (let i = 0; i < model.get('length'); i++) {
        let row = model.objectAt(i);
        promises.push(mixer.addPlaylist(row.playlist, row.ratio));
      }

      if (promises.length > 0) {
        Promise.all(promises)
        .then(function() {
          return mixer.createMixPlaylist(self.get('playlistName'), self.get('isPublic'), self.get('shuffle'));
        })
        .then(function() {
          self.send('showMessage', 'Well done! Your playlist has been created');
        })
        .catch(function(error) {
          this.send('showMessage', error.message || 'Unexpected error. Please try again', 'error');
        })
        .finally(function(){
          $btn.removeAttr('disabled');
          self.send('finished');
          self.set('loading', false);
        });
      }

      return false;
    }
  }

});

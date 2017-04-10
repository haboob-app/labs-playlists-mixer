import Ember from 'ember';
import ENV from "labs-playlists-mixer/config/environment";

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  rootUrl: ENV.rootURL,

  actions: {

    authenticate () {
      let self = this;
      this.get('session').open('spotify-oauth2-bearer').then(function(){
        self.transitionToRoute('mixer');
      }, function(error){
        self.set('error', error);
      });
    }
  }

});

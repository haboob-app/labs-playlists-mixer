import Ember from 'ember';
import SpotifyWebApi from "npm:spotify-web-api-node";

export default Ember.Object.extend({
  open: function(authorization){
    let client = new SpotifyWebApi();
    client.setAccessToken(authorization.authorizationToken.access_token);
    return client.getMe().then(function (data) {
      return {
        currentUserId: data.body.id,
        currentToken: authorization.authorizationToken.access_token
      };
    });
  }
});

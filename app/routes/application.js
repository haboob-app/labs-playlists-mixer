import Ember from 'ember';
import LoadingSliderMixin from '../mixins/loading-slider';

export default Ember.Route.extend(LoadingSliderMixin, {
  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  afterModel: function() {
    this.set('i18n.locale', this.calculateLocale());
  },

  calculateLocale() {
    // whatever you do to pick a locale for the user:
    var locale =  navigator.languages && navigator.languages[0] ||
    navigator.language ||
    navigator.userLanguage || 'en';
    return this.get('i18n.locales').indexOf(locale) >= 0 ? locale : 'en';
  },

  showMessage(message, type) {
    this.get('notifications').addNotification({
      message: message,
      type: type || 'success',
      autoClear: true,
      clearDuration: 3200
    });
  },

  actions: {
    showMessage(message, type) {
      this.showMessage(message, type);
      return false;
    },
    accessDenied: function() {
      this.transitionTo('index');
    }
  }
});

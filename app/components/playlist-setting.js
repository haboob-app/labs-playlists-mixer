import Ember from 'ember';

export default Ember.Component.extend({

  ratio: 1,

  showRemoveChanged: Ember.observer("showRemove", function() {
    if (!this.get("showRemove")) {
      this.set("ratio", 1);
    }
  }),

  actions: {
    remove() {
      this.sendAction('remove', this.get('index'));
    }
  }
});

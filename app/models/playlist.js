import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  uri: DS.attr('string'),
  owner: DS.belongsTo('user',{ async:false }),
  songs: DS.attr('', { defaultValue: Ember.A()}),
});

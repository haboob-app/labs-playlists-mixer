import Ember from 'ember';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');

    if (firstTimeOpenView) {
        firstTimeOpenView = false;
        Ember.TextField.reopen({
            init() {
                this._super();
                var self = this;

                // bind attributes beginning with 'data-'
                Object.keys(this.get('attrs')).forEach(function(key) {
                    if (key.substr(0, 5) === 'data-') {
                        self.get('attributeBindings').pushObject(key);
                    }
                });
            }
        });
    }
}

var firstTimeOpenView = true;

export default {
  name: 'text-field',
  initialize
};

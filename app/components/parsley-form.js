import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  didUpdateAttrs(attr) {
    if (attr.newAttrs.reset.value) {
      this.resetForm();
      this.set('reset', false);
    }
  },

  didInsertElement() {

    window.Parsley.setLocale(this.get('i18n.locale'));
    window.Parsley.options = Ember.merge(window.Parsley.options, {
      errorClass: 'has-danger',
      successClass: 'has-success',
      classHandler(ParsleyField) {
        return ParsleyField.$element.parents('.form-group');
      },
      errorsContainer(ParsleyField) {
        return ParsleyField.$element.parents('.form-group');
      },
      errorsWrapper: '<span class="form-control-feedback">',
      errorTemplate: '<small></small>'
    });

    this.$(this.element).find('*:input[type!=hidden]:first').focus();
  },
  resetForm() {
    let form = this.$(this.element).find('form');
    let parsleyForm = form.parsley();
    parsleyForm.reset();
    form.trigger("reset");
    Ember.run.later(function(){
      form.find('*:input[type!=hidden]:first').focus();
    },600);
  },
  actions: {
    submit() {
      let form = this.$(this.element).find('form');
      let parsleyForm = form.parsley();
      let validatedForm = parsleyForm.validate();

      if(validatedForm){
        this.sendAction('action', this.$(this.element).find('form :submit'));
      }
    },
    reset() {
      this.resetForm();
    }
  }
});

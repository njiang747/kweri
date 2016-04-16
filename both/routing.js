/***** Iron Router Routing File ***********************************************/
/* Handles different "pages" based on URL extensions */

/* Use layout template, main, for all pages, and use 
 * loadingt emplate, loading, while loading pages */
Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

/* Set the routing info, by default, uses the template with same name as the
 * extension */
Router.route('/', {
  layoutTemplate: '',
  name: 'home',
  template: 'home'
});

Router.route('/profileProf', {
  waitOn: function(){
    return Meteor.subscribe('classes', true, Meteor.userId());
  }
});
Router.route('/profileStud', {
  waitOn: function(){
    return Meteor.subscribe('classes', false, Meteor.userId());
  }
});
Router.route('/class/:class_id', {
  name: 'class',
  waitOn: function(){
    return [Meteor.subscribe('lectures', this.params.class_id), 
            Meteor.subscribe('classes', true, Meteor.userId())];
  }
});
Router.route('/lecture/:class_id/:lecture_id', {
  name: 'lecture',
  waitOn: function(){
    return [Meteor.subscribe('questions', this.params.lecture_id), 
            Meteor.subscribe('lectures', this.params.class_id), 
            Meteor.subscribe('classes', true, Meteor.userId())];
  }
});
Router.route('/questions', {
  waitOn: function(){
    return Meteor.subscribe('questions');
  }
});
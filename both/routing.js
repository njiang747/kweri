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
  name: 'login',
  template: 'login'
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
Router.route('/class/:_id', {
  name: 'class',
  waitOn: function(){
    return [Meteor.subscribe('lectures', this.params._id), 
            Meteor.subscribe('classes', true, Meteor.userId())];
  }
});
Router.route('/questions', {
  waitOn: function(){
    return Meteor.subscribe('questions');
  }
});
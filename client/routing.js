/***** Iron Router Routing File ***********************************************/
/* Handles different "pages" based on URL extensions */

/* Use layout template, main, for all pages, and use 
 * loadingt emplate, loading, while loading pages */
Router.configure({
  layoutTemplate: 'main',
  // loadingTemplate: 'loading',
  notFoundTemplate: 'main'
});

Router.onBeforeAction("loading");

/* Set the routing info, by default, uses the template with same name as the
 * extension */
Router.route('/', {
  layoutTemplate: '',
  name: 'home',
  template: 'home'
});

Router.route('/profile', {
  name: 'profile',
  template: 'profile',
  waitOn: function(){
    return [Meteor.subscribe('allClasses'), 
            Meteor.subscribe('allLectures'),
            Meteor.subscribe('allQuestions')];
  },
  action : function () {
   if (this.ready()) {
     this.render();
   }
 }
});
Router.route('/profileProf', {
  waitOn: function(){
    if (Meteor.user()) 
      return Meteor.subscribe('classes', 
        Meteor.user().profile.profStatus, 
        Meteor.userId());
    else return;
  }
});
Router.route('/profileStud', {
  waitOn: function(){
    return Meteor.subscribe('allClasses');
  }
});
Router.route('/class/:class_id', {
  name: 'class',
  waitOn: function(){
    if (Meteor.user()) 
      return [Meteor.subscribe('lectures', this.params.class_id), 
        Meteor.subscribe('classes', 
        Meteor.user().profile.profStatus, 
        Meteor.userId())];
    else return Meteor.subscribe('lectures', this.params.class_id);
  }
});
Router.route('/lecture/:class_id/:lecture_id', {
  name: 'lecture',
  waitOn: function(){
    if (Meteor.user()) 
      return [Meteor.subscribe('questions', this.params.lecture_id), 
            Meteor.subscribe('lectures', this.params.class_id), 
            Meteor.subscribe('classes', Meteor.user().profile.profStatus, 
              Meteor.userId())];
    else return Meteor.subscribe('questions', this.params.lecture_id), 
            Meteor.subscribe('lectures', this.params.class_id);
  }
});
Router.route('/questions', {
  waitOn: function(){
    return Meteor.subscribe('questions');
  }
});
Router.route('/about', {
  name: 'aboutpage',
  template:'aboutpage'
})
/***** Meteor Client File *****************************************************/
/* Code to be run client-side */

/* Two type of definitions: helpers & events.
 * Helpers define variables/functions used within templates
 * Events define actions to be taken upon events within templates */

/***** Profile Page ***********************************************************/
Template.classlist.helpers({
  /* classes returns a list of classes */
  classes: function() {
    return Classes.find({}, {sort: {listing: 1}});
  }
});

Template.classlist.events({
  /* clicking on a class redirects to that class's page */
  'click .class-listing': function() {
    Router.go('class', {_id: this._id});
  }
});

Template.addClass.events({
  /* insert a new class into the Classes collection */
  'submit .new-class': function(event) {
    var listing = event.target.listing.value;
    var name = event.target.name.value;
    Classes.insert({
      listing: listing,
      name: name,
      profs: [Meteor.userId()],
      students: []
    });
    event.target.listing.value = "";
    event.target.name.value = "";
    return false
  }
});

/***** Class Page *************************************************************/
Template.class.helpers({
  /* returns the listing of the current class */
  listing: function() {
    return Classes.findOne(Router.current().params._id).listing;
  },
  /* returns the name of the current class */
  name: function() {
    return Classes.findOne(Router.current().params._id).name;
  }
});

Template.lecturelist.helpers({
  /* lectures returns a list of lectures */
  lectures: function() {
    return Lectures.find({}, {sort: {number: -1}});
  }
});

Template.addLecture.events({
  /* insert a new lecture into the Lectures collection */
  'submit .new-lecture': function(event) {
    var number = parseInt(event.target.number.value);
    var name = event.target.name.value;
    Lectures.insert({
      class_id: Router.current().params._id,
      number: number,
      name: name,
      confuseNum: 0,
      totalNum: 0,
      date: new Date(),
      openStatus: true

    });
    event.target.number.value = "";
    event.target.name.value = "";
    return false
  }
});

/***** Lecture Page ***********************************************************/
Template.questionlist.helpers({
  /* questions returns a list of questions sorted by decreasing score
   * and decreasing creation date */
  questionsTop: function() {
    return Questions.find({}, {sort: {value: -1, createdAt: -1}});
  },
  questionsNew: function() {
    return Questions.find({}, {sort: {createdAt: -1}});
  }
});

Template.questionbox.events({
  /* submit a new question. return false means don't reload the page */
  'submit .questions-newQuestion': function(event) {
    /* get the text of the question */
    var qText = event.target.qText.value;
    if (qText == "") return false;
    // insert the question into the database
    Questions.insert({ 
      qText: qText,
      value: 1,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      upvotedBy: [Meteor.userId()]
    });
    // clear the question field
    event.target.qText.value = "";
    return false;
  }
});

Template.question.helpers({
  /* Function that converts a date to a string */
  createdAtToString: function() {
    var hours = this.createdAt.getHours();
    var period = "am"
    if (hours >= 12) period = "pm";
    hours = (hours % 12) || 12;
    return hours + this.createdAt.toTimeString().substr(2,3) + " " + period;
  },
  /* returns true if the user has upvoted the question and false otherwise */
  upvoted: function() {
    return this.upvotedBy && this.upvotedBy.indexOf(Meteor.userId()) != -1;
  }
});

Template.question.events({
  /* clicking the upvote button increases the question's value by 1 */
  'click .questions-up': function() {
    if (this.upvotedBy == undefined || 
        this.upvotedBy.indexOf(Meteor.userId()) == -1) {
      Questions.update(this._id, 
        {
          $set: {value: this.value + 1}, 
          $push: {upvotedBy: Meteor.userId()}
        });
    }
    return false;
  },
  /* clicking the downvote button decreases the question's value by 1 */
  'click .questions-down': function() {
    if (this.upvotedBy != undefined && 
        this.upvotedBy.indexOf(Meteor.userId()) != -1) {
      Questions.update(this._id, 
        {
          $set: {value: this.value - 1}, 
          $pull: {upvotedBy: Meteor.userId()}
        });
    }
    return false;
  }
});

Template.home.events({
  'click .btnlogin': function() {
    Router.go('/login');
  }
});

/* Account requires a username and password */
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

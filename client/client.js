/***** Meteor Client Section **************************************************/
/* Code to be run client-side */

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

Template.questionlist.helpers({
  /* questions returns a list of questions sorted by decreasing score
   * and decreasing creation date */
  questions: function() {
    return Questions.find({}, {sort: {value: -1, createdAt: -1}});
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
      value: 0,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      upvotedBy: []
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
  'click .questions-arrowUp': function() {
    if (this.upvotedBy == undefined || this.upvotedBy.indexOf(Meteor.userId()) == -1) {
      Questions.update(this._id, 
        {
          $set: {value: this.value + 1}, 
          $push: {upvotedBy: Meteor.userId()}
        });
    }
    return false;
  },
  /* clicking the downvote button decreases the question's value by 1 */
  'click .questions-arrowDown': function() {
    if (this.upvotedBy != undefined && this.upvotedBy.indexOf(Meteor.userId()) != -1) {
      Questions.update(this._id, 
        {
          $set: {value: this.value - 1}, 
          $pull: {upvotedBy: Meteor.userId()}
        });
    }
    return false;
  }
});

/* Account requires a username and password */
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

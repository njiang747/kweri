// Create a mongoDB collection named questions if one doesn't exit
// otherwise load the existing one into the variable Questions
Questions = new Mongo.Collection("questions");

// Function that converts a date to a sing
function dateToString( date ) {
  options = {
    hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

if (Meteor.isClient) {
  // Define helper functions/variables that are accessible in the
  // body section of the html
  Template.body.helpers({
    // questions returns a list of questions sorted by decreasing score
    // and decreasing creation date
    questions: function() {
      return Questions.find({}, {sort: {value: -1, createdAt: -1}});
    }
  });

  // Define action to be triggered on certain events within body
  Template.body.events({
    // Action upon submitting a new question
    'submit .new-question': function(event) {
      // get the text of the question
      var qText = event.target.qText.value;

      // if blank question return
      if (qText == "") return false;

      // insert the question into the database
      Questions.insert({ 
        qText: qText,
        value: 0,
        createdAt: new Date()
      });

      // clear the question field
      event.target.qText.value = "";
      
      // return false (don't reload the page)
      return false;
    }
  });

  // Define action to be triggered on certain events within a question template
  Template.question.events({
    // click event for upvoting
    'click .arrowUp': function() {
      Questions.update(this._id, {$set: {value: this.value + 1}});
      return false;
    },
    
    // click event for upvoting
    'click .arrowDown': function() {
      Questions.update(this._id, {$set: {value: this.value - 1}});
      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

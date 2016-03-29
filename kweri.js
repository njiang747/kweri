Questions = new Mongo.Collection("questions");

function dateToString( date ) {
  options = {
    hour: 'numeric', minute: 'numeric', timeZoneName: 'short'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

if (Meteor.isClient) {
  Template.body.helpers({
    questions: function() {
      return Questions.find({}, {sort: {value: -1, createdAt: -1}});
    }
  });

  Template.body.events({
    'submit .new-question': function(event) {
      var qText = event.target.qText.value;

      if (qText == "") return false;

      Questions.insert({ 
        qText: qText,
        value: 0,
        createdAt: new Date()
      });

      event.target.qText.value = "";
      
      return false;
    }
  });

  Template.question.events({
    'click .arrowUp': function() {
      Questions.update(this._id, {$set: {value: this.value + 1}});
      return false;
    },
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

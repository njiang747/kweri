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
    },
    userName: function() {
      return Meteor.user().profile.name;
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
    }, 
    'click .btn': function(){
      if(Meteor.user()){
        Meteor.logout();
        var settings = Meteor.settings.public.cas;
        openCenteredPopup(
          "https://fed.princeton.edu/cas/logout",
          settings.width || 800,
          settings.height || 600);
       } else {
          Meteor.loginWithCas(redirect);
       }
     
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

function redirect(error){
  if(!error){
    //window.location.replace("http://google.com");
  } else {
    alert("Please log in.");
  }
}
var openCenteredPopup = function(url, width, height) {
  var screenX = typeof window.screenX !== 'undefined'
  ? window.screenX : window.screenLeft;
  var screenY = typeof window.screenY !== 'undefined'
  ? window.screenY : window.screenTop;
  var outerWidth = typeof window.outerWidth !== 'undefined'
  ? window.outerWidth : document.body.clientWidth;
  var outerHeight = typeof window.outerHeight !== 'undefined'
  ? window.outerHeight : (document.body.clientHeight - 22);
  // XXX what is the 22?

  // Use `outerWidth - width` and `outerHeight - height` for help in
  // positioning the popup centered relative to the current window
  var left = screenX + (outerWidth - width) / 2;
  var top = screenY + (outerHeight - height) / 2;
  var features = ('width=' + width + ',height=' + height +
      ',left=' + left + ',top=' + top + ',scrollbars=yes');

  var newwindow = window.open(url, '_blank', features);
  if (newwindow.focus)
    newwindow.focus();
return newwindow;
};

//Meteor.user().profile.name
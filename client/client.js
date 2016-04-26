/***** Meteor Client File *****************************************************/
/* Code to be run client-side */

/* Two type of definitions: helpers & events.
 * Helpers define variables/functions used within templates
 * Events define actions to be taken upon events within templates */

/***** Main Layout ************************************************************/
Template.main.helpers({
  username: function() {
    return Meteor.user().profile.name;
  }
});

Template.main.events({
  'click .title-login': function(event) {
    Meteor.loginWithCas(function(err){if(err)alert("Failed to login")});
    return false;
  },
  'click .menu-logout': function(event) {
    if(Meteor.user()){
      Meteor.logout();
      openCenteredPopup(
        "https://fed.princeton.edu/cas/logout",
        810 || 800,
        610 || 600);
      Router.go('home');
    } 
    return false;
  }
});

/***** Home Page **************************************************************/
Template.home.events({
  'click .btnloginProf': function(event) {
    if(Meteor.user()){
      Router.go('profileProf');
    } else {
      Meteor.loginWithCas(
        function(err){
          if(err)alert("Failed to login");
          else {
            Meteor.users.update(Meteor.userId(), 
              {$set: {"profile.profStatus": 1}});
            Router.go('profileProf');
          }
      });
    }
    return false;
  },
  'click .btnloginStud': function(event) {
    if(Meteor.user()){
      Router.go('profileStud');
    } else {
      Meteor.loginWithCas(
        function(err){
          if(err)alert("Failed to login");
          else {
            Meteor.users.update(Meteor.userId(), 
              {$set: {"profile.profStatus": 0}});
            Router.go('profileStud');
          }
      });
    }
    return false;
  },
  'click .menu-logout': function(event) {
    if(Meteor.user()){
      Meteor.logout();
      openCenteredPopup(
        "https://fed.princeton.edu/cas/logout",
        810 || 800,
        610 || 600);
      Router.go('home');
    } 
    return false;
  }

});

/***** Profile Page ***********************************************************/
Template.classlist.helpers({
  /* classes returns a list of classes */
  classes: function() {
    if (Router.current().route.getName() == "profileProf") 
      return Classes.find({}, {sort: {department: 1, number: 1}});
    else if (Router.current().route.getName() == "profileStud") 
      return Classes.find({students: Meteor.userId()}, {sort: {department: 1, number: 1}})
  }
});

Template.classlist.events({
  /* clicking on a class redirects to that class's page */
  'click .class-listing': function() {
    Router.go('class', {class_id: this._id});
  }
});

Template.addClass.events({
  /* insert a new class into the Classes collection */
  'submit .new-class': function(event) {
    var department = event.target.department.value.toUpperCase();
    var number = event.target.number.value;
    var name = event.target.name.value;
    Classes.insert({
      department: department,
      number: number,
      name: name,
      profs: [Meteor.userId()], 
      students: []
    });
    event.target.department.value = "";
    event.target.number.value = "";
    event.target.name.value = "";
    return false
  }
});

Template.classSearch.events({
  'keyup .searchTerm': function(event) {
    Session.set('searchKey', event.target.value);
  }
});

Template.searchClasslist.helpers({
  /* classes returns a list of classes that match search term(s) */
  classes: function() {
    var key = Session.get('searchKey');
    if (key == null || key == "") return;
    var name = new RegExp(key, 'i');
    var arr = key.split(" ").filter(function(n) {return n != ''});
    var dept = new RegExp();
    var num = new RegExp();
    if (arr.length <= 2) {
      for (index in arr) {
        if (isNaN(arr[index])) {
          dept = new RegExp(arr[index], 'i');
        } else {
          num = new RegExp(arr[index]);
        }
      }
    } else return;
    return Classes.find(
      {$and: [
        {$or: [
          {$and: [{department: dept}, {number: num}]}, 
          {name: name}
        ]},
        {students: {$ne: Meteor.userId()}}
      ]}, 
      {sort: {department: 1, number: 1}});
  }
});

Template.searchClassElem.helpers({
  prof_names: function() {
    var prof_ids = this.profs;
    return Meteor.users.find({_id: prof_ids[0]});
  }
});

Template.searchClassElem.events({
  'click .enroll': function() {
    Classes.update({_id: this._id}, {$push: {students: Meteor.userId()}})
  }
});

/***** Class Page *************************************************************/
Template.class.helpers({
  /* returns the department of the current class */
  department: function() {
    return Classes.findOne(Router.current().params.class_id).department;
  },
  /* returns the number of the current class */
  number: function() {
    return Classes.findOne(Router.current().params.class_id).number;
  },
  /* returns the name of the current class */
  name: function() {
    return Classes.findOne(Router.current().params.class_id).name;
  }
});

Template.lecturelist.helpers({
  /* lectures returns a list of lectures */
  lectures: function() {
    return Lectures.find({}, {sort: {number: -1}});
  }
});

Template.lecturelist.events({
  /* clicking on a lecture redirects to that lecture's page */
  'click .lecture-listing': function() {
    Router.go('lecture', 
      {class_id: Router.current().params.class_id, lecture_id: this._id});
  }
});

Template.addLecture.events({
  /* insert a new lecture into the Lectures collection */
  'submit .new-lecture': function(event) {
    var number = parseInt(event.target.number.value);
    var name = event.target.name.value;
    Lectures.insert({
      class_id: Router.current().params.class_id,
      number: number,
      name: name,
      confuseList: [],
      totalList: [],
      date: new Date(),
      openStatus: true

    });
    event.target.number.value = "";
    event.target.name.value = "";
    return false
  }
});

/***** Lecture Page ***********************************************************/
Template.lecture.helpers({
  cDpt: function() {
    return Classes.findOne(Router.current().params.class_id).department;
  },
  cNum: function() {
    return Classes.findOne(Router.current().params.class_id).number;
  },
  cName: function() {
    return Classes.findOne(Router.current().params.class_id).name;
  },
  lNum: function() {
    return Lectures.findOne(Router.current().params.lecture_id).number;
  },
  lName: function() {
    return Lectures.findOne(Router.current().params.lecture_id).name;
  },
  dateString: function() {
    var date = Lectures.findOne(Router.current().params.lecture_id).date;
    return date.toDateString();
  }
});

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
      lecture_id: Router.current().params.lecture_id,
      qText: qText,
      value: 1,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      upvotedBy: [Meteor.userId()]
    });
    // clear the question field
    event.target.qText.value = "";
    return false;
  },
  'click .questions-con-button': function(){
    var lecture =  Lectures.findOne(Router.current().params.lecture_id);
    if (lecture.confuseList.indexOf(Meteor.userId()) == -1) {
      Lectures.update(Router.current().params.lecture_id, 
        {
          $push: {confuseList: Meteor.userId()}
        });
      var confuseTimerReset = setTimeout(confuseTimer, 60000);
    } else {
      Lectures.update(Router.current().params.lecture_id, 
        {
          $pull: {confuseList: Meteor.userId()}
        });
    }
    return false;
  }
});
var confuseTimer = function() {
    alert("1 minute elapsed, confusion status cleared");
    Lectures.update(Router.current().params.lecture_id, 
      {
        $pull: {confuseList: Meteor.userId()}
      });
}
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
  },

  "click .questions-delete": function () {
    Questions.remove(this._id);
  }
});

Template.questionConCounter.helpers({
  percent: function(){
    var lecture =  Lectures.findOne(Router.current().params.lecture_id);
    return Math.floor(lecture.confuseList.length/lecture.totalList.length*100);
  },
  color: function() {
    var lecture =  Lectures.findOne(Router.current().params.lecture_id);
    var per = 
      Math.floor(lecture.confuseList.length/lecture.totalList.length*100);
    if (per <= 25){
      return "progress-bar-success";
    } else if (per <= 50){
      return "progress-bar-warning";
    } else {
      return "progress-bar-danger";
    }
  }
});

Template.questionConCounter.events({
    /* Reset cc counter */
    'click .questions-conReset-button': function(){
      var lecture =  Lectures.findOne(Router.current().params.lecture_id);
      Lectures.update(Router.current().params.lecture_id, { $set : {confuseList: [] }} , {multi:true} );
    return false;
  }

});

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

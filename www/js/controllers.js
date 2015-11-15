angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  // Get an object from an array by property
  $scope.getArrayObjByProp = function(array, prop, val) {
    var result = array.filter(function( obj ) {
      return result = obj[prop] == val;
    });
  };

  // Track the user's ratings of legislation
  $scope.userRatings = [];
  // The user's grades of politicians
  $scope.userGrades = {};
  
  // Politicians
  // 'f'or
  // 'a'gainst
  // 'u'ndecided
  $scope.politicians = [
    {
      name: 'DarthVader',
      legislation1: 'a',
      legislation2: 'f',
      legislation3: 'a',
      legislation4: 'a',
      legislation5: 'u',
      legislation6: 'a',
      legislation7: 'a',
      legislation8: 'a',
    },
    {
      name: 'HanSolo',
      legislation1: 'a',
      legislation2: 'f',
      legislation3: 'a',
      legislation4: 'a',
      legislation5: 'u',
      legislation6: 'a',
      legislation7: 'a',
      legislation8: 'a',
    },
  ];
})

.controller('LegislationCtrl', function($scope, $stateParams, $state, resources, $ionicLoading) {
  // Provide a loading overlay as the content loads
  $scope.load = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    // Set the post ID if it has been passed to the view
    var id = $stateParams.id ? $stateParams.id : null;
    console.log('loading legislationctrl');
    var loadLegislation = function(){
      console.log('loading legislation');
    }
    // Only request data if it hasn't already been loaded
    // Get the post data
    resources.posts.query({
      'type[]': 'legislation',
      'filter[status]': 'publish',
      'filter[order]': 'DESC',
    },
    function(posts) {
      // Success callback
      console.log('post: ',posts);
      $scope.posts = posts;
      $scope.legislations = posts;
      if ( id ) {
        $scope.legislation = posts[id - 1];
        $scope.id = id;
      } 
      $ionicLoading.hide(); 
    },
    function(error) {
      // Error callback
      console.warn('An error occured:',error);
      $scope.posts = [{
        title: 'Error',
        content: error.data[0].message,
      }];
      $ionicLoading.hide(); 
    });
  };
  
  // Determines if there is another page after the current legislation page 
  // @param id (int) The legislation ID
  $scope.nextPageValue = function(id) {
    if ($scope.legislations[id]) {
      return parseInt(id) + 1;
    }
    console.log('on last page');
    return false;
  }
  
  // Direct the user to the next Legislation item
  // @param id (int) The ID of the current legislation item
  // @param action (string) The action to take [approve, deny, undecided]
  $scope.next = function(id, action) {
    if ( action === 'for' ) {
      console.log('I am for ', id);
      $scope.userRatings[id] = {
        stance: 'f'
      };
    } else if  ( action === 'against' ) {
      console.log('I am against ', id);
      $scope.userRatings[id] = {
        stance: 'a'
      };
    } else {
      console.log('I am undecided ', id);
      $scope.userRatings[id] = {
        stance: 'u'
      };
    }
    var nextPage = $scope.nextPageValue(id);
    if ( false != nextPage ) {
      // There is another legislation item to evaluate
      // Redirect the user
      $state.go('app.single',{id: nextPage });
    } else {
      // The user is on the last legislation item
      console.log('all done. My stance:', $scope.userRatings);
      $state.go('app.grade');
    }
  };
})

.controller('GradeCtrl', function($scope) {
  // Reload the grade
  $scope.reloadGrade = function(){
    for (var i = 0; i < $scope.politicians.length; i++) {
      console.group('evaluating politician ' + $scope.politicians[i].name);
      console.log('$scope.userRatings.length', $scope.userRatings.length);
      var politicianScore = 0;
      var agreementCounter = 0;
      for (var x=0; x < $scope.userRatings.length; x++) {
        // Only evaluate the ones the user has done becasue they might not have answered all
        if ($scope.userRatings[x]) {
          var userStance = $scope.userRatings[6];
          console.log('comparing politician stance on ' + x + ': ' + $scope.politicians[i]['legislation' + x] +', against user stance: ' + $scope.userRatings[x].stance );
          if ( 'u' == $scope.politicians[i]['legislation' + x] 
             ||  $scope.userRatings[x].stance != $scope.politicians[i]['legislation' + x]
          ) {
            // If the politician hasn't voted
            // or if the politician's stance disagrees with the user
            $scope.userRatings[x].value = -1;
            politicianScore -= 1;
          } else {
            $scope.userRatings[x].value = 1;
            politicianScore++;
            agreementCounter++;
          }
        }
      }
      // Compile the results of this politician compared to this user's stance

      // Count the number of object elements in an array
      function objectLength(obj) {
        var result = 0;
        for(var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            result++;
          }
        }
        return result;
      }
      // Compile the user's grade of this politician
      $scope.userGrades[i] = {
        answeredQuestions: objectLength($scope.userRatings),
        politicianScore: politicianScore,
        agreementCounter: agreementCounter,
      }
      
      $scope.userGrades[i].grade = $scope.userGrades[i].agreementCounter / $scope.userGrades[i].answeredQuestions * 100;
      console.log('politicianScore: ' + $scope.userGrades[i].politicianScore);
      console.log('grade: ' + $scope.userGrades[i].grade);
      console.log('agreementCounter: ' + $scope.userGrades[i].agreementCounter + ' out of '  + $scope.userGrades[i].answeredQuestions);
      console.groupEnd();
    }
  }
  // Only grade the politicians if the user has reviewed legislation
  if ( $scope.userRatings.length > 0 ) {
    $scope.reloadGrade();
  }
});
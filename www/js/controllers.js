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
  
  // Track the user's ratings of legislation
  $scope.userRatings = [];
  
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
    },
  ];
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', ID: 1 },
    { title: 'Chill', ID: 2 },
    { title: 'Dubstep', ID: 3 },
    { title: 'Indie', ID: 4 },
    { title: 'Rap', ID: 5 },
    { title: 'Cowbell', ID: 6 }
  ];
})

.controller('LegislationCtrl', function($scope, $stateParams, $state) {
  var id = $stateParams.id ? $stateParams.id : null;
  console.log('here. id:', id);
  $scope.legislations = [
    { title: 'Legislation 1', id: 1,
      content: '<p>Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    },
    { title: 'Legislation 2', id: 2,
      content: '<p>Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    },
    { title: 'Legislation 3', id: 3,
      content: '<p>Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    },
    { title: 'Legislation 4', id: 4,
      content: '<p>Objectively innovate empowered manufactured products whereas parallel platforms. Holisticly predominate extensible testing procedures for reliable supply chains. Dramatically engage top-line web services vis-a-vis cutting-edge deliverables.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    },
    { title: 'Legislation 5', id: 5,
      content: '<p>Proactively envisioned multimedia based expertise and cross-media growth strategies. Seamlessly visualize quality intellectual capital without superior collaboration and idea-sharing. Holistically pontificate installed base portals after maintainable products.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    },
    { title: 'Legislation 6', id: 6,
      content: '<p>Phosfluorescently engage worldwide methodologies with web-enabled technology. Interactively coordinate proactive e-commerce via process-centric "outside the box" thinking. Completely pursue scalable customer service through sustainable potentialities.</p>',
      meta: {
        link: 'http://representmenow.co',
      },
    }
  ];
  if ( id ) {
    $scope.legislation = $scope.legislations[id - 1];
    $scope.id = id;
  }
  
  $scope.nextPageValue = function(id) {
    if ($scope.legislations[id]) {
      return parseInt(id) + 1;
    }
    console.log('on last page');
    return false;
  }
  // Next page
  // id (int) The ID of the current legislation item
  // action (string) The action to take [approve, deny, undecided]
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
      console.log('I am undecided', id);
      $scope.userRatings[id] = {
        stance: 'u'
      };
    }
    var nextPage = $scope.nextPageValue(id);
    if ( false != nextPage ) {
      $state.go('app.single',{id: nextPage });
    } else {
      console.log('all done. My stance:', $scope.userRatings);
      // foreach (var i = 0; i < $scope.politicians.length; i++) {
        // console.log('evaluating politician: ' + politician.name);
        for (var i = 0; i < $scope.politicians.length; i++) {
            console.log('evaluating politician ' + $scope.politicians[i].name);
            console.log('$scope.userRatings.length', $scope.userRatings.length);
            var politicianGrade = 0;
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
                  politicianGrade -= 1;
                } else {
                  $scope.userRatings[x].value = 1;
                  politicianGrade++;
                }
                console.log('politicianGrade:' + politicianGrade);
              }
            }
        }
        alert('Your score against Darth Vader is: ' + politicianGrade);
      // }
    }
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

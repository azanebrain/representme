// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.router', 'ngResource'])

.factory('resources', function($resource) {
  var url = 'http://gsb2015.zanatlantean.com/wp-json';
  return {
    'posts': $resource(url + '/posts'),
  };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/legislationList.html',
          controller: 'LegislationCtrl'
        }
      }
    })
    .state('app.grade', {
      url: '/grade',
      views: {
        'menuContent': {
          templateUrl: 'templates/grade.html',
          controller: 'GradeCtrl'
        }
      }
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })
    .state('app.single', {
      url: '/legislation/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/legislation.html',
          controller: 'LegislationCtrl'
        }
      }
    })
    .state('app.splash', {
      url: '/splash',
      views: {
        'menuContent': {
          templateUrl: 'templates/splash.html',
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/splash');
});

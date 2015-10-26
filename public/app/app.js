'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngMessages',
  'authService',
  'app.main',
  'userService',
  'animalService',
  'filter',
  'app.signin',
  'app.register',
  'app.dashboard',
  'app.animal',
  'app.home'
]).
  config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider,
                                                                         $locationProvider,
                                                                         $httpProvider) {
    //$routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('AuthInterceptor');
  }]);

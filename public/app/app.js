'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'authService',
  'app.main',
  'userService',
  'app.signin'
]).
  config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider,
                                                                         $locationProvider,
                                                                         $httpProvider) {
    //$routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('AuthInterceptor');
  }]);

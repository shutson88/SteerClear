'use strict';

angular.module('app.signin', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signin', {
      templateUrl: 'signin/signin.html',
      controller: 'MainCtrl',
      controllerAs: 'login'
    });
  }]);
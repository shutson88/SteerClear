'use strict';

angular.module('app.register', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'signin/register.html',
      controller: 'MainCtrl',
      controllerAs: 'register'
    });
  }]);
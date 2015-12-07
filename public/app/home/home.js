/**
 * Created by nickfox on 10/20/15.
 */
'use strict';

angular.module('app.home', ['ngRoute', 'animalService'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html'
    });
  }]);
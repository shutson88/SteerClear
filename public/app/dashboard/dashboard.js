'use strict';

angular.module('app.dashboard', ['ngRoute', 'ngCookies', 'animalService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'user'
    });
  }])

  .controller('DashboardCtrl', ['Animal', 'Auth', '$cookies', function (Animal, Auth, $cookies) {
    var vm = this;

    console.log($cookies.get('username'));

    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;

    Animal.get()
      .success(function (data) {
        vm.animals = data;
      });

  }]);


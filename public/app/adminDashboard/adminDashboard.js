'use strict';

angular.module('app.adminDashboard', ['ngRoute', 'authService', 'userService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/adminDashboard', {
      templateUrl: 'adminDashboard/adminDashboard.html',
      controller: 'adminDashboardCtrl',
      controllerAs: 'admin'
    });
  }])

  .controller('adminDashboardCtrl', ['User', 'AuthToken', '$http', function (User, AuthToken, $http) {
    var vm = this;

    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;

	
	

	
    User.getYouth(AuthToken.getData().username)
      .success(function (data) {
		  console.log(data);
        vm.youths = data;
      });
    

  }]);


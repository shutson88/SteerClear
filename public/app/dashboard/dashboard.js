'use strict';

angular.module('app.dashboard', ['ngRoute', 'authService', 'ngCookies', 'animalService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'user'
    });
  }])

  .controller('DashboardCtrl', ['Animal', 'AuthToken', '$http', '$cookies', function (Animal, AuthToken, $http, $cookies) {
    var vm = this;

    console.log($cookies.get('username'));
    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;

	
	
	vm.addAnimal = function($scope){
	console.log("Adding animal: "+vm.add_id);
	$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, name: vm.addName, type: vm.addType, breed: vm.addBreed})
		.success(function (data, status, headers, config) {
			console.log(data);
			$http.get('/api/animals')
				.success(function (data) {
					vm.animals = data;
					console.log("Data: "+JSON.stringify(data));
				});
			})
	
	}
    Animal.get()
      .success(function (data) {
        vm.animals = data;
      });

  }]);


'use strict';

angular.module('app.dashboard', ['ngRoute', 'authService', 'animalService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard/:id?', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'user'
    });
  }])

  .controller('DashboardCtrl', ['Animal', 'AuthToken', 'Auth', '$routeParams', '$http', function (Animal, AuthToken, Auth, $routeParams, $http) {
    var vm = this;
	//console.log($routeParams.id);
	if($routeParams.id) {
		vm.id = $routeParams.id;
		//Auth.verifyPermission(vm.id);
		
		console.log("View dashboard for " + vm.id);
	} else {
		vm.id = AuthToken.getData().username
	}
	Animal.getAll(vm.id)
			.success(function (data) {
				console.log(data);
			vm.animals = data;
		});
    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;

	
	
	vm.addAnimal = function($scope){
	console.log("Adding animal: "+vm.add_id);
	$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, managedBy: vm.id, name: vm.addName, type: vm.addType, breed: vm.addBreed})
		.success(function (data, status, headers, config) {
			if(data.success) {
				$http.get('/api/animals')
				.success(function (data) {
					vm.animals = data;
					//console.log("Data: "+JSON.stringify(data));
					//Reset fields
					vm.add_id = '';
					vm.addName = '';
					vm.addType = '';
					vm.addBreed = '';
				});
				
			} else {
				console.log(data.message);
			}
			
			})
	
	}
	
	vm.addSupervisor = function() {
		console.log("Adding supervisor " + vm.addSupervisorID)
		$http.put("http://" + window.location.host + "/api/users/" + AuthToken.getData().username, {id: vm.addSupervisorID})
			.success(function(data, status, headers, config) {
				console.log(data);
				
				
			});
		
		
	}
	
	
	vm.removeFromUser = function(id) {
	console.log("removing " + id + " from user");
	$http.delete("http://" + window.location.host + "/api/animals/" + id)
		.success(function(data, status, headers, config) {
			console.log(data);
			if(data.success) {
				$http.get('/api/animals')
				.success(function(data) {
					vm.animals = data;
					//console.log(data);
					
				});
				
			} else {
				console.log(data.message);
			}
			
			
			
		});
	
	
	
	
	
	
	};
	
    

  }]);


'use strict';

angular.module('app.dashboard', ['ngRoute', 'authService', 'animalService', 'ui.bootstrap', 'ngAnimate'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard/:id?', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'user'
    });
  }])

  .controller('DashboardCtrl', ['Animal', 'User', 'AuthToken', 'Auth', '$routeParams', '$location', '$http', '$timeout', function (Animal, User, AuthToken, Auth, $routeParams, $location, $http, $timeout) {
    var vm = this;
	//console.log($routeParams.id);
	if($routeParams.id) {
		vm.id = $routeParams.id;
		//Auth.verifyPermission(vm.id);
		vm.observing = true;
		console.log("View dashboard for " + vm.id);
	} else {
		vm.observing = false;
		vm.id = AuthToken.getData().username
	}

	Animal.getAll(vm.id)
			.success(function (data) {
				console.log(data);
				if(data.success === false) {
					console.log(data.message);
				} else {
					vm.animals = data;
				}
				
				
				
		});
		
	User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;


	
	
	vm.addAnimal = function($scope){
	console.log("Adding animal: "+vm.add_id);
	$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, managedBy: vm.id, name: vm.addName, type: vm.addType, breed: vm.addBreed})
		.success(function (data, status, headers, config) {
			if(data.success) {
				$http.get('/api/animals/'+vm.id)
				.success(function (data) {
					vm.animals = data;
					console.log("Data: "+JSON.stringify(data));
					
					//Reset fields
					vm.add_id = '';
					vm.addName = '';
					vm.addType = '';
					vm.addBreed = '';
				});
				
			} else {
				console.log(data.message);
			}
			if(data.message) {vm.addAnimalMessage = data.message;} else {vm.addAnimalMessage = "Animal added successfully...";}
			vm.showAnimalMessage = true;
			$timeout(function() {
				vm.showAnimalMessage = false;
			
			}, 2000);
			
		});
	
	}
	
	vm.addSupervisor = function() {
		console.log("Adding supervisor " + vm.addSupervisorID)
		$http.put("http://" + window.location.host + "/api/users/", {id: vm.addSupervisorID})
			.success(function(data, status, headers, config) {
				console.log(data);
				User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
				if(data.message) {vm.addSupervisorMessage = data.message;} else {vm.addSupervisorMessage = "Supervisor added successfully...";}
				vm.showSupervisorMessage = true;
				$timeout(function() {
					vm.showSupervisorMessage = false;
				
				}, 2000);
			});
		
		
	}
	
	vm.removeSupervisor = function(id) {
		console.log("removing " + id + " as supervisor");
		$http.put("http://" + window.location.host + "/api/users/", {id: id, stop: true})
			.success(function(data, status, headers, config) {
				User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
				if(data.message) {vm.removeSupervisorMessage = data.message;} else {vm.removeSupervisorMessage = "Supervisor removed successfully...";}
				vm.showRemoveSupervisorMessage = true;
				$timeout(function() {
					vm.showRemoveSupervisorMessage = false;
				
				}, 2000);
			});
	}
	
	vm.removeFromUser = function(id) {
	console.log("removing " + id + " from user");
	$http.delete("http://" + window.location.host + "/api/animal/" + id)
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

	vm.openAnimalPage = function(animal){
		$location.path("/animal/").search({id: animal._id, name: animal.name, type: animal.type, breed: animal.breed, observing: vm.observing});

		
	};
	
	vm.goHome = function() {
		$location.url("/");
		
	}
    

  }]);


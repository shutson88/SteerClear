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
				} else if(data.success == true) {
					vm.animals = data.data;
				}
				
				
				
		});
		
	User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
    vm.sortType = '_id';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;
	vm.addAnimalMessage = {};
	vm.addSupervisorMessage = {};
	vm.removeSupervisorMessage = {};

	
	
	vm.addAnimal = function($scope){
		console.log("Adding animal: "+vm.add_id + " " + vm.addName + " " + vm.addType + " " + vm.addBreed);
		
		$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, managedBy: vm.id, name: vm.addName, type: vm.addType, breed: vm.addBreed})
			.success(function (data, status, headers, config) {
				if(data.success) {
					$http.get('/api/animals/'+vm.id)
					.success(function (data) {
						vm.animals = data.data;
						console.log("Data: "+JSON.stringify(data));
						
						//Reset fields
						vm.add_id = '';
						vm.addName = '';
						vm.addType = '';
						vm.addBreed = '';
					});
					
					vm.addAnimalMessage.alertType = 'alert-success';
				} else {
					vm.addAnimalMessage.alertType = 'alert-warning';
				}
				if(data.message) {vm.addAnimalMessage.message = data.message;} else {vm.addAnimalMessage.message = "missing message";}
				vm.addAnimalMessage.show = true;
				$timeout(function() {
					vm.addAnimalMessage.show = false;
				
				}, 2000);
				
			});
		
	}
	
	vm.addSupervisor = function() {
		console.log("Adding supervisor " + vm.addSupervisorID)
		$http.put("http://" + window.location.host + "/api/users/", {id: vm.addSupervisorID})
			.success(function(data, status, headers, config) {
				console.log(data);
				User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
				if(data.success) {
					vm.addSupervisorMessage.alertType = 'alert-success';
				} else {
					vm.addSupervisorMessage.alertType = 'alert-warning';
				}
				
				if(data.message) {vm.addSupervisorMessage.message = data.message;} else {vm.addSupervisorMessage.message = "missing message";}
				vm.addSupervisorMessage.show = true;
				$timeout(function() {
					vm.addSupervisorMessage.show = false;
				
				}, 2000);
			});
		
		
	}
	
	vm.removeSupervisor = function(id) {
		console.log("removing " + id + " as supervisor");
		$http.put("http://" + window.location.host + "/api/users/", {id: id, stop: true})
			.success(function(data, status, headers, config) {
				User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});
				if(data.success) {
					vm.removeSupervisorMessage.alertType = 'alert-success';
				} else {
					vm.removeSupervisorMessage.alertType = 'alert-warning';
				}
				if(data.message) {vm.removeSupervisorMessage.message = data.message;} else {vm.removeSupervisorMessage.message = "missing message";}
				vm.removeSupervisorMessage.show = true;
				$timeout(function() {
					vm.removeSupervisorMessage.show = false;
				
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
		$location.path("/animal/").search({id: animal._id, name: animal.name, type: animal.type, breed: animal.breed, observing: vm.observing, user: vm.id});

		
	};
	
	vm.goHome = function() {
		$location.url("/");
		
	}
	
	vm.goObserving = function() {
		$location.url('/observeDashboard');
	}
    

  }]);


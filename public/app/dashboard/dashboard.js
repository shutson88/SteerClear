'use strict';

angular.module('app.dashboard', ['ngRoute', 'authService', 'animalService', 'typeService', 'ui.bootstrap', 'ngAnimate'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard/:id?', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'user'
    });
  }])

  .controller('DashboardCtrl', ['Animal', 'User', 'Type', 'AuthToken', 'Auth', '$routeParams', '$location', '$http', '$timeout', '$scope', function (Animal, User, Type, AuthToken, Auth, $routeParams, $location, $http, $timeout, $scope) {
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
			if(data.success === false) {
				console.log(data.message);
				vm.message = data.message;
			} else if(data.success == true) {
				vm.animals = data.data;
				if(vm.animals.length == 0) {
					$scope.searchPlaceholder = "You have no animals";
				} else {
					$scope.searchPlaceholder = "Search Animals";
				}
			}
		});
		

    vm.sortType = '_id';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;
	vm.addAnimalMessage = {};


	
	
	vm.addAnimal = function($scope){
		console.log("Adding animal: "+vm.add_id + " " + vm.addName + " " + vm.selectTypes + " " + vm.selectBreeds);
		
		$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, managedBy: vm.id, name: vm.addName, type: vm.selectTypes, breed: vm.selectBreeds})
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
		$location.path("/animal/" + animal._id).search({observing: vm.observing, user: vm.id});

		
	};
	
	vm.goHome = function() {
		$location.url("/");
		
	}
	
	vm.goObserving = function() {
		$location.url('/observeDashboard');
	}
    Type.get(function(data) {
		var types = {};
		
		for(var i = 0; i < data.data.length; i++) {
			types[data.data[i].type] = data.data[i].breeds;
		}
		vm.existingTypes = types;
	});
	vm.getBreedOptions = function() {
		vm.existingBreeds = vm.existingTypes[vm.selectTypes];
	}
  }]);


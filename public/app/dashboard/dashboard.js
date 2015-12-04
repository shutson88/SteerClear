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


	vm.activeAnimals = [];
	vm.retiredAnimals = {};
	var updateArrays = function(data) {
		vm.activeAnimals = [];
		vm.retiredAnimals = {};
		vm.animals = data;
		var key = "";
		
		for(var i = 0; i < vm.animals.length; i++) {
			if(vm.animals[i].active == true) {
				vm.activeAnimals.push(vm.animals[i]);
			} else {
				key = vm.animals[i].projectYear;
				if(!vm.retiredAnimals.hasOwnProperty(String(key))) {
					vm.retiredAnimals[String(key)] = [];
				}
				vm.retiredAnimals[String(key)].push(vm.animals[i]);
			}
			
		}
		if(jQuery.isEmptyObject(vm.retiredAnimals)) {
			vm.hideInactive = true;
		}
	};
    
    
    
	Animal.getAll(vm.id)
		.success(function (data) {
			if(data.success === false) {
				console.log(data.message);
				vm.message = data.message;
			} else if(data.success == true) {
				updateArrays(data.data);
				
			}
		});
    
    
    vm.sortType = 'id';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;
	vm.addAnimalMessage = {};
    
    
	
	
	vm.addAnimal = function($scope){
		console.log("Adding animal: "+vm.add_id + " " + vm.addName + " " + vm.selectTypes + " " + vm.selectBreeds + " " + vm.addProjectYear);
		
		$http.post("http://" + window.location.host + "/api/animals/", {id: vm.add_id, managedBy: vm.id, name: vm.addName, type: vm.selectTypes, breed: vm.selectBreeds, projectyear: vm.addProjectYear})
			.success(function (data, status, headers, config) {
				if(data.success) {
					$http.get('/api/animals/'+vm.id)
					.success(function (data) {
						updateArrays(data.data);
						console.log("Data: "+JSON.stringify(data));
						
						//Reset fields
						vm.add_id = '';
						vm.addName = '';
						vm.addType = '';
						vm.addBreed = '';
						vm.addProjectYear = '';
						vm.selectTypes = '';
						vm.selectBreeds = '';
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
	
	
	vm.removeFromUser = function(id, retire) {
		console.log("removing " + id + " from user");
		var url = '';
		if(retire) {
			url = "http://" + window.location.host + "/api/animal/" + id + "?retire=true";
		} else {
			url = "http://" + window.location.host + "/api/animal/" + id;
		}
		$http.delete(url)
			.success(function(data, status, headers, config) {
				console.log(data);
				if(data.success) {
					$http.get('/api/animals')
					.success(function(data) {
						updateArrays(data.data);
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


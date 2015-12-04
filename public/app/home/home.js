/**
 * Created by nickfox on 10/20/15.
 */
'use strict';

angular.module('app.home', ['ngRoute', 'animalService', 'typeService', 'ui.bootstrap'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html',
	  controller: 'homeCtrl',
	  controllerAs: 'home'
    });
  }])
  
  
  .controller('homeCtrl', ['Type', '$location', '$http', '$timeout', 'Auth', function(Type, $location, $http, $timeout, Auth) {
	var vm = this;

	vm.addTypeMessage = {};
	vm.removeTypeMessage = {};
	vm.getBreedOptions = function() {
		vm.existingBreeds = vm.existingTypes[vm.selectTypes];
	}
	
	vm.addType = function() {
		var breedToAdd;
		var typeToAdd;
		
		if(vm.textType) {
			typeToAdd = vm.textType;
			//console.log("[TEXT] Type to add: " + typeToAdd);
		} else {
			typeToAdd = vm.selectTypes;
			//console.log("[SELECT] Type to add: " + typeToAdd);
		}
		
		if(vm.textBreed) {
			breedToAdd = vm.textBreed;
			//console.log("[TEXT] Breed to add: " + breedToAdd);
		} else {
			breedToAdd = vm.selectBreeds;
			//console.log("[SELECT] Breed to add: " + breedToAdd);
		}		
		
		
		
		
		$http.post("http://" + window.location.host + "/api/breeds", {type: typeToAdd, breed: breedToAdd})
			.success(function(data, status, headers, config) {
				if(data.message) {vm.addTypeMessage.message = data.message;} else {vm.addTypeMessage.message = "missing message";}
				vm.addTypeMessage.show = true;
				$timeout(function() {
					vm.addTypeMessage.show = false;
				
				}, 2000);
				if(data.success === true) {
					
					Type.get(function(data) {
							var types = {};
							console.log(data.data);
							for(var i = 0; i < data.data.length; i++) {
									types[data.data[i].type] = data.data[i].breeds;
							}
													
							vm.existingTypes = types;
							vm.getBreedOptions();
							vm.textType = "";
							vm.textBreed = "";
							vm.selectTypes = "";
							vm.selectBreed = "";						
					});
					
				}
			});
		
		
	};
	
	vm.removeType = function(typeToRemove, breedToRemove) {
		console.log("Type: " + typeToRemove + ", Breed: " + breedToRemove);
		var url = '';
		if(typeToRemove && !breedToRemove) {
			url = "http://" + window.location.host + "/api/breeds?type=" + typeToRemove;
		} else if(typeToRemove && breedToRemove) {
			url = "http://" + window.location.host + "/api/breeds?type=" + typeToRemove + "&breed=" + breedToRemove;
		}
		$http.delete(url)
			.success(function(data, status, headers, config) {
				if(data.message) {vm.removeTypeMessage.message = data.message;} else {vm.removeTypeMessage.message = "missing message";}
				vm.removeTypeMessage.show = true;
				$timeout(function() {
					vm.removeTypeMessage.show = false;
				
				}, 2000);
				if(data.success == true) {
					Type.get(function(data) {
							var types = {};
							
							for(var i = 0; i < data.data.length; i++) {
									types[data.data[i].type] = data.data[i].breeds;
							}
													
							vm.existingTypes = types;
							vm.getBreedOptions();
							vm.textType = "";
							vm.textBreed = "";
							vm.selectTypes = "";
							vm.selectBreed = "";						
					});					
				}
				
			});
		
	}
	
	if(Auth.isLoggedIn()) {
		Type.get(function(data) {
			var types = {};
			for(var i = 0; i < data.data.length; i++) {
				types[data.data[i].type] = data.data[i].breeds;
			}
			vm.existingTypes = types;
		});
		
	}


	  

  }]);
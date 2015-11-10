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
  
  
  .controller('homeCtrl', ['Type', '$location', '$http', '$timeout', function(Type, $location, $http, $timeout) {
	var vm = this;

	
	vm.getBreedOptions = function() {
		//console.log(vm.selectTypes);
		//console.log("Populating breeds");
		vm.existingBreeds = vm.existingTypes[vm.selectTypes];
		//console.log(vm.existingBreeds);
		
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
				if(data.message) {vm.addTypeMessage = data.message;} else {vm.addTypeMessage = "Message missing";}
				vm.showTypeMessage = true;
				$timeout(function() {
					vm.showTypeMessage = false;
				
				}, 2000);
				if(data.success === true) {
					
					Type.get()
						.success(function (data) {
							var types = {};
							
							for(var i = 0; i < data.types.length; i++) {
									types[data.types[i].type] = data.types[i].breeds;
							}
													
							vm.existingTypes = types;
							vm.getBreedOptions();
							vm.textType = "";
							vm.textBreed = "";
							vm.selectTypes = "";
							vm.selectBreeds = "";
			
					});
				}
			});
		
		
	};
	

		Type.get()
			.success(function (data) {
				var types = {};
				
				for(var i = 0; i < data.types.length; i++) {
						types[data.types[i].type] = data.types[i].breeds;
				}
						
				vm.existingTypes = types;
				
				
			});

	  

  }]);
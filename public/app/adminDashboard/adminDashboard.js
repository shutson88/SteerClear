'use strict';

angular.module('app.adminDashboard', ['ngRoute', 'authService', 'userService', 'typeService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/adminDashboard', {
      templateUrl: 'adminDashboard/adminDashboard.html',
      controller: 'adminDashboardCtrl',
      controllerAs: 'admin'
    });
  }])

  .controller('adminDashboardCtrl', ['User', 'AuthToken', 'Type', '$http', function (User, AuthToken, Type, $http) {
    var vm = this;

    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
	vm.addUserCollapsed = false;

	
	vm.addYouth = function() {
		
		
	};

	
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
				if(data.success === true) {
					Type.get()
						.success(function (data) {
							var types = {};
							
							for(var i = 0; i < data.types.length; i++) {
									types[data.types[i].type] = data.types[i].breeds;
							}
													
							vm.existingTypes = types;
							vm.getBreedOptions();
			
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
	
	
    User.getYouth(AuthToken.getData().username)
		.success(function (data) {
			console.log(data);
			vm.youths = data;
	});
    

  }]);


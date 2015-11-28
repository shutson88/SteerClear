'use strict';

angular.module('app.observeDashboard', ['ngRoute', 'authService', 'userService', 'typeService', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/observeDashboard', {
      templateUrl: 'observeDashboard/observeDashboard.html',
      controller: 'observeDashboardCtrl',
      controllerAs: 'observe'
    });
  }])

  .controller('observeDashboardCtrl', ['User', 'AuthToken', 'Type', '$http', '$location', function (User, AuthToken, Type, $http, $location) {
    var vm = this;

    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
	vm.addUserCollapsed = false;

	
	vm.stopObserving = function(id) {
		console.log("Stopping observation of " + id);
		$http.put("http://" + window.location.host + "/api/users/", {id: id, stop: true})
			.success(function(data, status, headers, config) {
				console.log(data);
				if(data.success == true) {
					User.getObserved()
						.success(function (data) {
							console.log(data);
							vm.youths = data;
						});
					
				} else {
					alert(data.message);
				}
				
				
			});
		
	};
	

	vm.openUserPage = function(user) {
		console.log(user);
		$location.path('/dashboard/' + user._id);
	};
	
    User.getObserved()
		.success(function (data) {
			console.log(data);
			vm.youths = data;
		});
    
	
	vm.goHome = function() {
		$location.url("/");
		
	};
  }]);


'use strict';

var manage = angular.module('app.manage', ['ngRoute']);

manage.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/manage', {
      templateUrl: 'accountManagement/manage.html',
      controller: 'ManageCtrl',
      controllerAs: 'manage'
    });
}]);

manage.controller('ManageCtrl', [ '$http', '$location', function($http, $location) {
	
	
	var vm = this;
	
	vm.changePassword = function() {
		if(vm.newPassword == vm.newPasswordConfirm) {
			$http.put("http://" + window.location.host + "/api/user/", 
			{currentPassword: vm.currentPassword, newPassword: vm.newPassword})
			.success(function (data, status, headers, config) {
				if(data.success) {
					console.log("Password updated successfully");
				} else {
					console.log("Password update failed");
				}
				
			});
		}

						
		
	};
	
	vm.resetPassword = function() {
		$http.put("http://" + window.location.host + "/api/passreset/",
		{email: vm.email})
		.success(function (data, status, headers, config) {
			if(data.success) {
				
			} else {
				
			}
			
		});
		
	};
	
}]);

manage.directive('passwordMatch', [function() {
	return {
		require: 'ngModel',
		scope: true,
		link: function(scope, elem, attrs, ctrl) {
			var checker = function() {
				var e1 = scope.$eval(attrs.passwordMatch);
				var e2 = scope.$eval(attrs.ngModel);
				return e1 === e2;
			};
			scope.$watch(checker, function(n) {
				ctrl.$setValidity("pwmatch", n);
			});
		}		
	};	
}]);
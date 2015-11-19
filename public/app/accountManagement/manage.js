'use strict';

var manage = angular.module('app.manage', ['ngRoute']);

manage.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/manage/:resettoken?', {
      templateUrl: 'accountManagement/manage.html',
      controller: 'ManageCtrl',
      controllerAs: 'manage'
    });
}]);

manage.controller('ManageCtrl', [ '$http', '$location', '$routeParams', '$timeout', function($http, $location, $routeParams, $timeout) {
	
	
	var vm = this;
	
	vm.resetToken = $routeParams.resettoken;
	
	vm.changePasswordMessage = {};
	vm.resetPasswordMessage = {};
	
	vm.changePassword = function() {
		if(vm.newPassword == vm.newPasswordConfirm) {
			$http.put("http://" + window.location.host + "/api/user/", 
			{currentPassword: vm.currentPassword, newPassword: vm.newPassword})
			.success(function (data, status, headers, config) {
				console.log(data);
				if(data.success) {
					vm.changePasswordMessage.alertType = 'alert-success';
				} else {
					vm.changePasswordMessage.alertType = 'alert-warning';
				}
				if(data.message) {vm.changePasswordMessage.message = data.message;} else {vm.changePasswordMessage.message = "missing message";}
				vm.changePasswordMessage.show = true;				
				$timeout(function() {
					vm.changePasswordMessage.show = false;
				}, 2000);
							

				
			});
		}

						
		
	};
	
	vm.resetPassword = function() {
		if(vm.resetToken && vm.resetNewPassword) {
			$http.put("http://" + window.location.host + "/api/passreset/",
			{resetToken: vm.resetToken, resetNewPassword: vm.resetNewPassword})
			.success(function (data, status, headers, config) {
				if(data.success) {
					vm.resetPasswordMessage.alertType = 'alert-success';
				} else {
					vm.resetPasswordMessage.alertType = 'alert-warning';
				}
				if(data.message) {vm.resetPasswordMessage.message = data.message;} else {vm.resetPasswordMessage.message = "missing message";}
				vm.resetPasswordMessage.show = true;
				$timeout(function() {
					vm.resetPasswordMessage.show = false;
				
				}, 2000);
				
			});
			
			
		} else {
			
		
		
			$http.put("http://" + window.location.host + "/api/passreset/",
			{email: vm.email})
			.success(function (data, status, headers, config) {
				if(data.success) {
					vm.resetPasswordMessage.alertType = 'alert-success';
				} else {
					vm.resetPasswordMessage.alertType = 'alert-warning';
				}
				if(data.message) {vm.resetPasswordMessage.message = data.message;} else {vm.resetPasswordMessage.message = "missing message";}
				vm.resetPasswordMessage.show = true;
				$timeout(function() {
					vm.resetPasswordMessage.show = false;
				
				}, 2000);
				
			});
		}
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
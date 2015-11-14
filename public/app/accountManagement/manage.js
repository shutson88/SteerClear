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
	
	
	vm.changePassword = function() {
		if(vm.newPassword == vm.newPasswordConfirm) {
			$http.put("http://" + window.location.host + "/api/user/", 
			{currentPassword: vm.currentPassword, newPassword: vm.newPassword})
			.success(function (data, status, headers, config) {
				console.log(data);
				if(data.message) {vm.changePasswordMessage = data.message;} else {vm.changePasswordMessage = "missing message";}
				vm.showChangePasswordMessage = true;
				$timeout(function() {
					vm.showChangePasswordMessage = false;
				
				}, 2000);
							
				if(data.success) {
					console.log("Password updated successfully");
				} else {
					console.log("Password update failed");
				}
				
			});
		}

						
		
	};
	
	vm.resetPassword = function() {
		if(vm.resetToken && vm.resetNewPassword) {
			$http.put("http://" + window.location.host + "/api/passreset/",
			{resetToken: vm.resetToken, resetNewPassword: vm.resetNewPassword})
			.success(function (data, status, headers, config) {
				if(data.message) {vm.resetPasswordMessage = data.message;} else {vm.resetPasswordMessage = "missing message";}
				vm.showResetPasswordMessage = true;
				$timeout(function() {
					vm.showResetPasswordMessage = false;
				
				}, 2000);
				
			});
			
			
		} else {
			
		
		
			$http.put("http://" + window.location.host + "/api/passreset/",
			{email: vm.email})
			.success(function (data, status, headers, config) {
				if(data.message) {vm.resetPasswordMessage = data.message;} else {vm.resetPasswordMessage = "missing message";}
				vm.showResetPasswordMessage = true;
				$timeout(function() {
					vm.showResetPasswordMessage = false;
				
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
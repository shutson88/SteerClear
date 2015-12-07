'use strict';

var manage = angular.module('app.manage', ['ngRoute']);

manage.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/manage/:resettoken?', {
      templateUrl: 'accountManagement/manage.html',
      controller: 'ManageCtrl',
      controllerAs: 'manage'
    });
}]);

manage.controller('ManageCtrl', [ 'Auth', 'User', '$http', '$location', '$routeParams', '$timeout', function(Auth, User, $http, $location, $routeParams, $timeout) {
	
	
	var vm = this;
	
	vm.resetToken = $routeParams.resettoken;
	vm.addSupervisorMessage = {};
	vm.removeSupervisorMessage = {};	
	vm.changePasswordMessage = {};
	vm.resetPasswordMessage = {};
	User.getObservedBy(function(supervisors) {vm.supervisors = supervisors});	
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
					Auth.logout();
					$location.path('/signin');
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
					Auth.logout();
					$location.path('/signin');					
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
					Auth.logout();
					$location.path('/signin');				
				}, 2000);

			});
		}
	};
	
	vm.addObserver = function() {
		console.log("Adding supervisor " + vm.addObserverID.toLowerCase())
		$http.put("http://" + window.location.host + "/api/users/", {id: vm.addObserverID.toLowerCase()})
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
	
	vm.removeObserver = function(id) {
		console.log("removing " + id + " as observer");
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
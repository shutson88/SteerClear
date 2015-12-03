'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', [
  'ngRoute',
  'ngMessages',
  'authService',
  'app.main',
  'userService',
  'animalService',
  'typeService',
  'filter',
  'app.signin',
  'app.register',
  'app.dashboard',
  'app.observeDashboard',
  'app.animal',
  'app.home',
  'app.manage'
]);


app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider,
                                                                         $locationProvider,
                                                                         $httpProvider) {
    //$routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('AuthInterceptor');
  }]);
  
app.directive('ngConfirm', [ function() {
	return {
		link: function(scope, element, attr) {
			
			var clickAction = attr.ngClickConfirm;
			element.bind('click', function(event) {
				var msg = attr.ngConfirm || "Are you sure?";
				if(window.confirm(msg)) {
					scope.$eval(clickAction);
				}
			});
			
		}
		
		
	};
	
	
}]);


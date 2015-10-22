'use strict';

angular.module('app.main', ['ngRoute'])

  .controller('MainCtrl', ['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();

      Auth.getUser(Auth.username)
        .then(function(data) {
          vm.user = data.data;
        });
    });

    vm.doLogin = function() {
      vm.processing = true;

      vm.error = '';

      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {
          vm.processing = false;

          if(data.success){
            $location.path('/dashboard');
          } else {
            vm.error = data.message;
          }
        });
    };

    vm.createTestUser = function() {
      vm.error = '';

      Auth.generateUser(vm.loginData.username, vm.loginData.password)
        .success(function(data) {
          vm.error = data.message;
        })
    };

    vm.doLogout = function() {
      Auth.logout();

      vm.user = '';
      $location.path('/signin');
    };

    vm.editAnimal = function() {

      $location.path('/signin');
    };

  }]);
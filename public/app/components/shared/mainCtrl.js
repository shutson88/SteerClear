'use strict';

angular.module('app.main', ['ngRoute', 'ngCookies'])
    .controller('MainCtrl', ['$rootScope', '$location', 'Auth', '$cookies', function($rootScope, $location, Auth, $cookies) {

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
            //Expires in 1 day
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
              console.log('Username in MainCtrl: '+Auth.username);
            $cookies.put('username', Auth.username, {'expires': expireDate});

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
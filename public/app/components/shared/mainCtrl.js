'use strict';

angular.module('app.main', ['ngRoute'])
    .controller('MainCtrl', ['$rootScope', '$location', "$http", 'Auth', 'AuthToken', function($rootScope, $location, $http, Auth, AuthToken) {

  var vm = this;
  //Unread notifications
  vm.unread = 0;
  vm.user = {};
  console.log(vm.user);
    vm.loggedIn = Auth.isLoggedIn();
	vm.checkAdmin = function() {
		if(Auth.isAdmin()) {
			return true;
			
		} else {
			return false;
		}
		
		
	};
    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
		  vm.loggedIn = Auth.isLoggedIn();
		  vm.user = AuthToken.getData();
      console.log("Username: "+vm.user.username);
      $http.get('/api/user', {headers:  {
        'username': vm.user.username
       }
      })
        .success(function (data) {
          if(data.success == false) {
            alert(data.message);
          } else if(data.success = true) {
            //console.log("Successful");
            vm.notifications = data.notifications;
            for(var i = 0; i < data.notifications.length; i++){
              if(!vm.notifications[i].read){
                vm.unread++;
              }
            }

          }

          //console.log("Data: "+JSON.stringify(data));
        });
      //console.log("vm user: "+JSON.stringify(vm.user));

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
            //console.log('Username in MainCtrl: '+Auth.username);

          if(data.success){
			  
            $location.path('/');
          } else {
            vm.error = data.message;
          }
        });
    };

	vm.goToRegister = function() {
		$location.path('/register');		
	};
	
	vm.goToLogin = function() {
		$location.path('/signin');
	};
	
    vm.registerUser = function(isValid) {
      if(isValid) {
        vm.error = '';

        Auth.generateUser(vm.loginData.username,
          vm.loginData.password,
          vm.loginData.email,
          vm.loginData.fname,
          vm.loginData.lname,
		  vm.loginData.isAdmin,
		  vm.loginData.adminCode)
          .success(function (data) {
            if (data.success) {
              $location.path('/signin');
            } else {
              vm.error = data.message;
            }


          })
      } else {
        console.log('Form is not Valid');
      }
    };

    vm.doLogout = function() {
      Auth.logout();

      vm.user = '';
      vm.unread = 0;
      $location.path('/signin');
    };

    vm.editAnimal = function() {

      $location.path('/signin');
    };

  }]);
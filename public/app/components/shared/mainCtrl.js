'use strict';

angular.module('app.main', ['ngRoute'])
    .controller('MainCtrl', ['$rootScope', '$location', "$http", 'Auth', 'AuthToken', function($rootScope, $location, $http, Auth, AuthToken) {

  var vm = this;
  //Unread notifications
  vm.unread = 0;
  vm.notifications = [];
  vm.user = {};
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
		if(vm.loggedIn) {
			vm.user = AuthToken.getData();
			console.log("Username: "+vm.user.username);
			$http.get('/api/user', {headers:  {'username': vm.user.username}})
				.success(function (data) {
					if(data.success == false) {
						alert(data.message);
					} else if(data.success = true) {
						//console.log("Successful");
						vm.unread = 0;
						vm.notifications = data.notifications;
						for(var i = 0; i < data.notifications.length; i++){
    						if(!vm.notifications[i].read){
    							vm.unread++;
    						}
						}

					}
				});
		}
    });

    vm.readNotifications = function() {
        $http({
            method: 'PUT',
            url: '/api/notifications'
        }).then(function successCallback(response) {
            vm.notifications.forEach(function(notification) {
                notification.read = true;
            });
            // console.log('Marked all notifications as read!');
            vm.unread = 0;
            document.getElementById("unreadNotifications").innerHTML = vm.unread;
        }, function errorCallback(response) {
            console.log('ERROR: ' + response);
        });
    }

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

    vm.goToNotification = function(notification) {
        $http({
            method: 'PUT',
            url: '/api/notifications/' + notification.date
        }).then(function successCallback(response) {
            notification.read = true;
            if(vm.unread > 0) vm.unread--;
            document.getElementById("unreadNotifications").innerHTML = vm.unread;
            $location.path('/dashboard/' + notification.sender);
        }, function errorCallback(response) {
            console.log('ERROR: ' + response);
        });
    }

    vm.setNotificationColor = function(notification) {
        if(!notification.read) return { background: "#d8d8ff" }
    }

    vm.deleteNotification = function(notification) {
        console.log(notification.date);
        $http({
            method: 'DELETE',
            url: '/api/notifications/' + notification.date
        }).then(function successCallback(response) {
            var index = vm.notifications.indexOf(notification)
            if(index > -1) {
                vm.notifications.splice(index, 1);
            }
            if(vm.unread > 0) vm.unread--;
            document.getElementById("unreadNotifications").innerHTML = vm.unread;
        }, function errorCallback(response) {
            console.log('ERROR: ' + response);
        });
    }

}]);

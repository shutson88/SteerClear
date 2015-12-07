/**
 * Created by nickfox on 10/17/15.
 */

angular.module('authService', [])

// ===================================================
// auth factory to signin and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================

  .factory('Auth', function ($http, $q, AuthToken) {
    var authFactory = {};

	
	authFactory.verifyPermission = function(id) {
		$http.get('/api/users' + id)
			.success(function(data) {
				if(data.managedBy === AuthToken.getData().username) {
					return true;
					
				} else {
					return false;
				}
				
			});
		
	}
	
    authFactory.login = function (username, password) {
      return $http.post('/api/authenticate', {
        username: username,
        password: password
      })
        .success(function (data) {
          AuthToken.setData(data);

          return data;
        });
    };

    authFactory.generateUser = function(username, password, email, fname, lname, isAdmin, adminCode) {
      return $http.post('/api/user', {
        username: username,
        password: password,
        email: email,
        first_name: fname,
        last_name: lname,
		admin_code: adminCode
      })
        .success(function (data) {
          return data;
        });
    };

    authFactory.logout = function () {
      AuthToken.setData();
    };

    authFactory.isLoggedIn = function () {
      if(AuthToken.getToken()) {
        return true;
      } else {
        return false;
      }
    };

	authFactory.isAdmin = function () {
		if(AuthToken.getData().admin == 'true') {
			return true;
			
		} else {
			return false;
		}
		
		
	};
	
    authFactory.getUser = function() {
      if(AuthToken.getToken()) {
		  console.log(AuthToken.getData());
        return $http.get('api/users/' + AuthToken.getData().username, {cache: true});
      } else {
        return $q.reject({ message: 'User has no token.' });
      }
    };

    return authFactory;
  })

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================

  .factory('AuthToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
      return $window.sessionStorage.getItem('token');
    };
	
	authTokenFactory.getData = function() {
		var data = {};
		data.username = $window.sessionStorage.getItem('username');
		data.fname = $window.sessionStorage.getItem('fname');
		data.lname = $window.sessionStorage.getItem('lname');
		data.email = $window.sessionStorage.getItem('email');
		data.admin = $window.sessionStorage.getItem('admin');
		return data;
		
	};
	
	
    authTokenFactory.setData = function(data) {
      if(data) console.log(data);
	  if(data) {
        $window.sessionStorage.setItem('token', data.token);
		$window.sessionStorage.setItem('username', data.username);
		$window.sessionStorage.setItem('fname', data.fname);
		$window.sessionStorage.setItem('lname', data.lname);
		$window.sessionStorage.setItem('email', data.email);
		$window.sessionStorage.setItem('admin', data.admin);
      } else {
        $window.sessionStorage.removeItem('token');
		$window.sessionStorage.removeItem('username');
		$window.sessionStorage.removeItem('fname');
		$window.sessionStorage.removeItem('lname');
		$window.sessionStorage.removeItem('email');
		$window.sessionStorage.removeItem('admin');
      }
    };

    return authTokenFactory;
  })

// ===================================================
// application configuration to integrate token into requests
// ===================================================

  .factory('AuthInterceptor', function($q, AuthToken) {
    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function(config) {
      var token = AuthToken.getToken();

      if(token) {
        config.headers['token'] = token;
      }

      return config;
    };

    interceptorFactory.responseError = function(response) {

      // if our server returns a 403 forbidden response
      if(response.status == 403) {
        AuthToken.setToken();
        $location.path('/signin');
      }

      return $q.reject(response);
    };

    return interceptorFactory;
  });
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

    authFactory.login = function (username, password) {
      return $http.post('/api/authenticate', {
        username: username,
        password: password
      })
        .success(function (data) {
          AuthToken.setToken(data.token);
          authFactory.username = username;
          return data;
        });
    };

    authFactory.generateUser = function(username, password) {
      return $http.post('/register', {
        username: username,
        password: password,
        email: 'bogus@email.com',
        first_name: 'earthworm',
        last_name: 'jim'
      })
        .success(function (data) {
          return data;
        });
    };

    authFactory.logout = function () {
      AuthToken.setToken();
    };

    authFactory.isLoggedIn = function () {
      if(AuthToken.getToken()) {
        return true;
      } else {
        return false;
      }
    };

    authFactory.getUser = function() {
      if(AuthToken.getToken()) {
        return $http.get('api/users/' + authFactory.username, {cache: true});
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
      return $window.localStorage.getItem('token');
    };

    authTokenFactory.setToken = function(token) {
      if(token) {
        $window.localStorage.setItem('token', token)
      } else {
        $window.localStorage.removeItem('token');
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
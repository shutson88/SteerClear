/**
 * Created by nickfox on 10/16/15.
 */
angular.module('userService', [])

  .factory('User', function($http) {
    var userFactory = {};

    var serverAddress = 'http://localhost:8080';

    //Get a single user
    userFactory.get = function(id) {
		
      return $http.get(serverAddress + '/api/users/' + id);
    };

    //Get all users
    userFactory.get = function() {
      return $http.get(serverAddress + '/api/users/');
    };

    //TODO: Update user

    //TODO: Delete user

    return userFactory;

  });
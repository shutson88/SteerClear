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

    //Get youth you are observing
    userFactory.getObserved = function() {
		console.log("Getting youth you are observing");
		return $http.get(serverAddress + '/api/users/');
    };
	
	userFactory.getObservedBy = function(callback) {
		console.log("Getting users observing you");
		$http.get("http://" + window.location.host + '/api/user/')
			.success(function(data) {
				if(data.observedBy.length <= 0) {
					callback([]);
				} else {
					callback(data.observedBy);
				}
			});
		
		
	};

    //TODO: Update user

    //TODO: Delete user

    return userFactory;

  });
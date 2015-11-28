/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('typeService', [])
  .factory('Type', function($http) {
    var typeFactory = {};

    typeFactory.get = function(callback) {
      console.log("Getting types and breeds");
      $http.get('/api/breeds/')
		.success(function(data) {
			callback(data);
		});

    };

    typeFactory.post = function() {
      console.log("Adding type");
      return $http.get('/api/animals/' + id);
    }; 

		
    return typeFactory;
  });
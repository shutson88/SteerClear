/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('typeService', [])
  .factory('Type', function($http) {
    var typeFactory = {};

    typeFactory.get = function() {
      console.log("Getting types and breeds");
      return $http.get('/api/breeds/');
    };

    typeFactory.post = function() {
      console.log("Adding type");
      return $http.get('/api/animals/' + id);
    }; 

		
    return typeFactory;
  });
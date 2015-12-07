/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('animalService', [])
  .factory('Animal', function($http) {
    var animalFactory = {};

    animalFactory.getOne = function(id, callback) {
      console.log("ID is "+ id);
      $http.get('/api/animal/' + id) 
		.success(function(data) {
			callback(data);
		});

    };

    animalFactory.getAll = function(id) {
      console.log("Getting animals for " + id);
      return $http.get('/api/animals/' + id);
    }; 

		
    return animalFactory;
  });
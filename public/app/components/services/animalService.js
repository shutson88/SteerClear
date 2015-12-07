/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('animalService', [])
  .factory('Animal', function($http) {
    var animalFactory = {};

    animalFactory.getOne = function(id) {
      console.log("ID is "+ id);
      return $http.get('/api/animal/' + id);
    };

    animalFactory.getAll = function(id) {
      console.log("Getting animals for " + id);
      return $http.get('/api/animals/' + id);
    }; 

		
    return animalFactory;
  });
/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('animalService', [])
  .factory('Animal', function($http) {
    var animalFactory = {};

    animalFactory.get = function(id) {
      console.log("ID is "+ id);
      return $http.get('/api/animals/id');
    };

    animalFactory.get = function() {
      console.log("Here still");
      return $http.get('/api/animals');
    };

    return animalFactory;
  });
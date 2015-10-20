/**
 * Created by nickfox on 10/19/15.
 */
angular
  .module('animalService', [])
  .factory('Animal', function($http) {
    var animalFactory = {};

    animalFactory.get = function(id) {
      return $http.get('/api/animals/id');
    };

    animalFactory.get = function() {
      return $http.get('/api/animals');
    };

    return animalFactory;
  });
'use strict';

angular.module('app.animal', ['ngRoute', 'animalService', 'ui.bootstrap', 'filter'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/animal/:animalID', {
        templateUrl: 'animal/animal.html',
        controller: 'AnimalCtrl',
        controllerAs: 'animal'
      });
    }])

    .controller('AnimalCtrl', ['$routeParams', '$http', function ($routeParams, $http) {
      var vm = this;

      vm.animalID = $routeParams.animalID;
      console.log(vm.animalID);

      vm.sortType = 'breed';
      vm.sortReverse = false;
      vm.searchAnimals = '';
      vm.addUserCollapsed = false;

      $http.get('/api/weights/'+vm.animalID)
          .success(function (data) {
            vm.animals = data;
            console.log("Data: "+JSON.stringify(data));
          });

      vm.addWeight = function($scope){
        console.log("Adding weight for: "+vm.date);
        $http.post("http://" + window.location.host + "/api/weights/"+vm.animalID, {date: vm.date, weight: vm.weight})
            .success(function (data, status, headers, config) {
                console.log(data);
                $http.get('/api/weights/'+vm.animalID)
                    .success(function (data) {
                      vm.animals = data;
                      console.log("Data: "+JSON.stringify(data));
                    });
              })
        //$http({
        //  url: "http://" + window.location.host + "/api/weights/"+vm.id,
        //  method: "POST",
        //  data: {
        //    date: vm.date,
        //    weight: vm.weight
        //  },
        //  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        //}).success(function (data, status, headers, config) {
        //  console.log(data); // assign  $scope.persons here as promise is resolved here
        //}).error(function (data, status, headers, config) {
        //  $scope.status = status;
        //});
      }

	  vm.calculate = function($scope) {
		  if(vm.targetWeight) {
			  console.log("target weight");
			  
		  } else if(vm.targetDate) {
			  console.log("target date");
			  
		  }
		  
		  
		  
		  
		  
		  
	  }
	  
	  
      vm.getCurrentDate = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd < 10) {
          dd='0' + dd;
        }
        if(mm < 10) {
          mm='0' + mm;
        }
        today = mm+'/'+dd+'/'+yyyy;
        console.log(today);
        console.log(vm.weight);
        vm.date = today;


      }

    }]);


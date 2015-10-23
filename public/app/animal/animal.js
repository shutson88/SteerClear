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
		  var regressionData = new Array();

		  for(var i = 0; i < vm.animals.length; i++) {
			  
			  regressionData[i] = [vm.animals[i].date, vm.animals[i].weight]; //build array [date, weight] for regression fitting
		  }
		  regressionData.sort(function(a,b) {
			 return new Date(a[0]) - new Date(b[0]); //sort array from earliest to latest
			  
		  });
		  var referenceDate = regressionData[0][0]; //take the earliest date as a referece
		  
		  for(var i = 0; i < regressionData.length; i++) {
			  var second = new Date(regressionData[i][0]);
			  var first = new Date(referenceDate);
			regressionData[i][0] = Math.round((second-first)/(1000*60*60*24));
			  console.log("Days since start : " + Math.round((second-first)/(1000*60*60*24)));		
			
		  }
		  //TODO: ensure that each date is unique so that the data can be used to form a regression line
		  console.log(regressionData);
		  
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


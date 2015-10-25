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
			  
			  regressionData.push([vm.animals[i].date, vm.animals[i].weight]); //build array [date, weight] for regression fitting
		  }
		  regressionData.sort(function(a,b) {
			 return new Date(a[0]) - new Date(b[0]); //sort array from earliest to latest
		  });
      console.log("Regression data:" + regressionData);

      //Calculate average of each day to make unique date array
      var averageDates = new Array();
      var currentDate = regressionData[0][0];
      var averageWeight = 0;
      var averageSum = 0;

      console.log("Current date: " + currentDate);
      console.log(regressionData.length);
      for (var i = 0; i < regressionData.length; i++){
        if(currentDate === regressionData[i][0]){
          averageWeight += regressionData[i][1];
          averageSum++;
        }
        else{
          averageDates.push([currentDate, averageWeight/averageSum]);
          currentDate = regressionData[i][0];
          averageWeight = regressionData[i][1];
          averageSum = 1;
        }
        if(i === regressionData.length - 1){

          averageDates.push([currentDate, averageWeight/averageSum]);
          currentDate = regressionData[i][0];
          averageWeight = regressionData[i][1];
        }
      }
      //console.log("Average dates"+averageDates);
      regressionData = averageDates;

      //console.log("Regression data:" + regressionData);
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


    }]);


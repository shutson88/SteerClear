'use strict';

angular.module('app.animal', ['ngRoute', 'animalService', 'ui.bootstrap', 'filter'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/animal/', {
      templateUrl: 'animal/animal.html',
      controller: 'AnimalCtrl',
      controllerAs: 'animal'
    });
  }])

  .controller('AnimalCtrl', ['$routeParams', '$http', '$location', '$scope', '$timeout', function ($routeParams, $http, $location, $scope, $timeout) {
    var vm = this;
	vm.params = $location.search();
	console.log(vm.params);
    vm.animalID = vm.params.id;
    //console.log(vm.animalID);
	//console.log($routeParams.observing);
	if(vm.params.observing == true || vm.params.observing == 'true') {
		vm.observing = true;
	} else {
		vm.observing = false;
	}
	vm.date = new Date();

    vm.sortType = 'date';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;
    vm.rangeDateCollapsed = false;
    vm.targetDateCollapsed = false;
    vm.selectedRow = null;
    vm.selectedRow2 = null;
    vm.alternateSelection = false;
    vm.targetDate = null;
    $scope.setClickedRow = function(index){
      console.log("SJIFSAJI");
      vm.selectedRow = index;
    }

	vm.editMessage = {};
	vm.addWeightMessage = {};
	vm.targetMessage = {};
	vm.adgMessage = {};
	
    $http.get('/api/weights/'+vm.animalID)
      .success(function (data) {
        if(data.success == false) {

			alert(data.message);
		} else if(data.success = true) {
			vm.animals = data.data;
		}
		
        console.log("Data: "+JSON.stringify(data));
      });



	
	vm.editAnimal = function() {
		$http.put("http://" + window.location.host + "/api/animal/"+vm.animalID, {newName: vm.newName, newType: vm.newType, newBreed: vm.newBreed})
			.success(function (data, status, headers, config) {
				if(vm.newName) {vm.params.name = vm.newName;}
				console.log(vm.params.name);
				if(data.success) {
					vm.editMessage.alertType = 'alert-success';
				} else {
					vm.editMessage = 'alert-warning';
				}
				if(data.message) {vm.editMessage.message = data.message;} else {vm.editMessage.message = "missing message";}
				vm.editMessage.show = true;
				$timeout(function() {
					vm.editMessage.show = false;
				
				}, 2000);
				
			});
		
	};
	

	vm.removeFromUser = function() {
		$http.delete("http://" + window.location.host + "/api/animal/" + vm.animalID)
				.success(function(data, status, headers, config) {
					console.log(data);
					if(data.success) {
						$location.url('/dashboard/');
						
					} else {
						console.log(data.message);
					}
					
					
					
				});		
		
		
	};
	  
	vm.removeWeight = function(id) {
		$http.delete("http://" + window.location.host + "/api/weight/" + id)
			.success(function(data, status, headers, config) {
				console.log(data.message);
				$http.get('/api/weights/'+vm.animalID)
				.success(function (data) {
					vm.animals = data.data;
				});				
				
			});
	};
	  
    vm.addWeight = function($scope){
      console.log("Adding weight for: "+vm.date);
      $http.post("http://" + window.location.host + "/api/weights/"+vm.animalID, {date: vm.date, weight: vm.weight})
        .success(function (data, status, headers, config) {
			if(data.success) {
				vm.addWeightMessage.alertType = 'alert-success';
			} else {
				vm.addWeightMessage.alertType = 'alert-warning';
			}
			if(data.message) {vm.addWeightMessage.message = data.message;} else {vm.addWeightMessage.message = "missing message";}
			vm.addWeightMessage.show = true;
			$timeout(function() {
				vm.addWeightMessage.show = false;
			
			}, 2000);
			$http.get('/api/weights/'+vm.animalID)
			.success(function (data) {
				
			
				vm.animals = data.data;
				//console.log("Data: "+JSON.stringify(data));
				
			});
        });
    }


    vm.getAverageArray = function() {

      var regressionData = new Array();

      for (var i = 0; i < vm.animals.length; i++) {

        regressionData.push([vm.animals[i].date, vm.animals[i].weight]); //build array [date, weight] for regression fitting
      }

      regressionData.sort(function (a, b) {
        return new Date(a[0]) - new Date(b[0]); //sort array from earliest to latest
      });

      //Calculate average of each day to make unique date array
      var averageDates = new Array();
      var currentDate = regressionData[0][0];
      var averageWeight = 0;
      var averageSum = 0;

      console.log("Current date: " + currentDate);
      console.log(regressionData.length);
      for (var i = 0; i < regressionData.length; i++) {
        if (currentDate === regressionData[i][0]) {
          averageWeight += regressionData[i][1];
          averageSum++;
        }
        else {
          averageDates.push([currentDate, averageWeight / averageSum]);
          currentDate = regressionData[i][0];
          averageWeight = regressionData[i][1];
          averageSum = 1;
        }
        if (i === regressionData.length - 1) {

          averageDates.push([currentDate, averageWeight / averageSum]);
          currentDate = regressionData[i][0];
          averageWeight = regressionData[i][1];
        }
      }
      console.log("getAvgArray:" + averageDates);
      return averageDates;


    }

    vm.averageGainInRange = function () {
      if (!vm.start_date || !vm.end_date) {
        vm.data = "Please enter start date and end date."
      }
      else if (vm.start_date > vm.end_date) {
        vm.data = "Start date must be before end date."
      }
      else {
        var averageDates = vm.getAverageArray();
        //console.log("Days: "+ (new Date(vm.end_date) - new Date(vm.start_date))/ (1000 * 3600 * 24));
        var numDays = (new Date(vm.end_date) - new Date(vm.start_date))/ (1000 * 3600 * 24);

        var dailyGains = new Array();
        for (var i = 0; i < averageDates.length; i++) {
          console.log(averageDates[i][1]);

          if (i < averageDates.length - 1 && new Date(averageDates[i][0]) >= new Date(vm.start_date) && new Date(vm.end_date) >= new Date(averageDates[i + 1][0])) {
            dailyGains.push(averageDates[i + 1][1] - averageDates[i][1])
          }
        }
        var averageDailyGain = 0;
        //console.log("Daily gains: " + dailyGains);
        for (var i = 0; i < dailyGains.length; i++) {
          averageDailyGain += dailyGains[i];
        }
        if (dailyGains.length === 0) {
          vm.data = "Average daily weight gain: 0";
          return 0;
        }
        else {
          vm.data = "Average daily weight gain: " + Math.round((averageDailyGain / numDays)*10)/10;
          return averageDailyGain / numDays;
        }
      }
    }

    vm.targetDateCalculator = function(){
		if(vm.targetDate == null){
			vm.data = "Please enter a target date"
			vm.targetMessage.alertType = 'alert-warning';
			vm.targetMessage.message = vm.data;
			vm.targetMessage.show = true;
			$timeout(function() {
				vm.targetMessage.show = false;
			
			}, 2000);
		}
		
		//Get ADG of latest two with list of weights
		var averageDates = vm.getAverageArray();
		//Start Period is the day two weeks prior to last weigh in
		var startPeriod = new Date(averageDates[averageDates.length-1][0]);
		startPeriod.setDate(startPeriod.getDate()-14);
		
		//Get all weight inputs of last two weeks
		var boundedDates = new Array();
		for(var i = 0; i < averageDates.length; i++){
		if(new Date(averageDates[i][0]) >= new Date(startPeriod)){
			if(boundedDates.length == 0){
			startPeriod = new Date(averageDates[i][0]);
			}
			boundedDates.push(averageDates[i]);
		
		}
		}
		
		console.log("Last two weeks: "+boundedDates);
		console.log("Target date: "+vm.targetDate);
		
		//Store user input start and end date temporarily in order to calculate 2 week adg
		var start_date = vm.start_date;
		var end_date = vm.end_date;
		vm.start_date = startPeriod;
		vm.end_date = new Date(averageDates[averageDates.length-1][0]);
		var adg = vm.averageGainInRange();
		console.log("adg: "+adg);
		vm.start_date = start_date;
		vm.end_date = end_date;
		
		//Current weight of animal
		var targetWeight = averageDates[averageDates.length-1][1];
		var numDays = Math.floor((new Date(vm.targetDate) - new Date(averageDates[averageDates.length-1][0]))/ (1000 * 3600 * 24));
		console.log("Num Days: "+numDays);
		var gain = numDays*adg;
		targetWeight += gain;
		var formattedDate = vm.targetDate.toLocaleDateString("en-US");
		vm.data = "Target weight at "+formattedDate+" is estimated to be "+Math.round(targetWeight)+"lbs";
		vm.targetMessage.message = vm.data;
		vm.targetMessage.alertType = 'alert-success';
		vm.targetMessage.show = true;
    }

    //When two rows are selected, calculate the ADG in that date range
    vm.calculateADG = function(){

      if(vm.selectedRow == null || vm.selectedRow == null){
        vm.data = "Please click two rows (start and end)"
		vm.adgMessage.alertType = 'alert-warning';
		vm.adgMessage.message = vm.data;
		vm.adgMessage.show = true;
		$timeout(function() {
			vm.adgMessage.show = false;
		
		}, 2000);

      }
      else {
        if(vm.selectedRow < vm.selectedRow2) {
          vm.start_date = vm.selectedRow;
          vm.end_date = vm.selectedRow2;
        }
        else{
          vm.start_date = vm.selectedRow2;
          vm.end_date = vm.selectedRow;
        }

        vm.selectedRow = null;
        vm.selectedRow2 = null;

        console.log("VM: " + JSON.stringify(vm));


        vm.averageGainInRange();
		vm.adgMessage.message = vm.data;
		vm.adgMessage.alertType = 'alert-success';
		vm.adgMessage.show = true;

      }


    }

    vm.selectDates = function(date){
		if(vm.selectedRow == date) {
			vm.selectedRow = null;
			vm.alternateSelection = false;
		} else if(vm.selectedRow2 == date) {
			vm.selectedRow2 = null;
			vm.alternateSelection = true;
		} else {
			if(vm.alternateSelection) {
				vm.selectedRow2 = date;
				vm.alternateSelection = false;
			} else {
				vm.selectedRow = date;
				vm.alternateSelection = true;
			}			
		}
    }

    vm.highlight = function(date){

      //console.log("Row1: " + vm.selectedRow);
      //console.log("Row2: " + vm.selectedRow2);
      if(date == vm.selectedRow){
        return "selected";
      }
      if(date == vm.selectedRow2 && date != vm.selectedRow){
        return "selected";
      }
    }

	vm.goDashboard = function() {
		
		$location.url("/dashboard/");
	}
	
  }]);


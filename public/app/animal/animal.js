'use strict';

angular.module('app.animal', ['ngRoute', 'ui.bootstrap'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/animal/:animalID', {
      templateUrl: 'animal/animal.html',
      controller: 'AnimalCtrl',
      controllerAs: 'animal'
    });
  }])

  .controller('AnimalCtrl', ['$routeParams', '$http', '$location', '$scope', '$timeout', 'Animal', 'Type', function ($routeParams, $http, $location, $scope, $timeout, Animal, Type) {
    var vm = this;
    vm.params = $location.search();
    // console.log(vm.params);
    if (vm.params.observing == true || vm.params.observing == 'true') {
      vm.observing = true;
    } else {
      vm.observing = false;
    }
    vm.date = new Date();
    vm.animal = {};
	vm.processing = true;
    Animal.getOne($routeParams.animalID, function (data) {
		vm.processing = false;
		if (data.success) {
			vm.animal = data.data;
		}
    });


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
    vm.calculateTargetDate = false;
    $scope.setClickedRow = function (index) {
      vm.selectedRow = index;
    }

    vm.editMessage = {};
    vm.addWeightMessage = {};
    vm.targetMessage = {};
    vm.adgMessage = {};
    vm.newWeightTimeout = undefined;
    vm.editAnimalTimeout = undefined;
    vm.targetDateTimeout = undefined;
    vm.calculateAdgTimeout = undefined;
    vm.animalID = $routeParams.animalID;

    $http.get('/api/weights/' + $routeParams.animalID)
      .success(function (data) {
        if (data.success == false) {

          alert(data.message);
        } else if (data.success = true) {
          vm.weights = data.data;
        }

        // console.log(vm.weights);
      });


    vm.editAnimal = function () {
      $http.put("http://" + window.location.host + "/api/animal/" + $routeParams.animalID, {
        newName: vm.newName,
        newType: vm.selectTypes,
        newBreed: vm.selectBreeds
      })
        .success(function (data, status, headers, config) {
			if (data.success) {
				vm.selectTypes = "";
				vm.selectBreeds = "";
				vm.newName = "";
				
				vm.editMessage.alertType = 'alert-success';
				Animal.getOne($routeParams.animalID, function (data) {
					if (data.success) {
						vm.animal = data.data;
					}
				});
			} else {
				vm.editMessage.alertType = 'alert-warning';
			}
			if (data.message) {
				vm.editMessage.message = data.message;
			} else {
				vm.editMessage.message = "missing message";
			}
			vm.editMessage.show = true;
			if (vm.editAnimalTimeout) $timeout.cancel(vm.editAnimalTimeout);
			vm.editAnimalTimeout = $timeout(function () {
				vm.editMessage.show = false;
	
			}, 2000);

        });

    };


	vm.removeFromUser = function(id, retire) {
		console.log("removing " + id + " from user");
		var url = '';
		if(retire) {
			url = "http://" + window.location.host + "/api/animal/" + id + "?retire=true";
		} else {
			url = "http://" + window.location.host + "/api/animal/" + id;
		}
		$http.delete(url)
			.success(function(data, status, headers, config) {
				console.log(data);
				if(data.success) {
					$location.url('/dashboard/');;
				} else {
					console.log(data.message);
				}
			});
	};
    vm.removeWeight = function (weightID, animalID) {
    //   console.log("Animal ID: " + animalID);
      $http.delete("http://" + window.location.host + "/api/weight/" + weightID)
        .success(function (data, status, headers, config) {
          console.log(data.message);
          $http.get('/api/weights/' + animalID)
            .success(function (data) {
              vm.weights = data.data;
            });

        });
    };

    vm.addWeight = function (id) {
    //   console.log("Adding weight for: " + id);

      $http.post("http://" + window.location.host + "/api/weights/" + id, {date: vm.date, weight: vm.weight})
        .success(function (data, status, headers, config) {
          if (data.success) {
            vm.addWeightMessage.alertType = 'alert-success';
          } else {
            vm.addWeightMessage.alertType = 'alert-warning';
          }
          if (data.message) {
            vm.addWeightMessage.message = data.message;
          } else {
            vm.addWeightMessage.message = "missing message";
          }
          vm.addWeightMessage.show = true;
          if (vm.addWeightTimeout) $timeout.cancel(vm.addWeightTimeout);
          vm.addWeightTimeout = $timeout(function () {
            vm.addWeightMessage.show = false;

          }, 2000);
          $http.get('/api/weights/' + id)
            .success(function (data) {


				vm.weights = data.data;
				//console.log("Data: "+JSON.stringify(data));
				vm.weight = '';
				
            });
        });
    }



    vm.getDateDifference = function getDateDifference(start, end) {

      var _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      var utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
      var utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }


    vm.getAverageArray = function () {

      var regressionData = new Array();

      for (var i = 0; i < vm.weights.length; i++) {

        regressionData.push([vm.weights[i].date, vm.weights[i].weight]); //build array [date, weight] for regression fitting
      }

      regressionData.sort(function (a, b) {
        return new Date(a[0]) - new Date(b[0]); //sort array from earliest to latest
      });

      //Calculate average of each day to make unique date array
      var averageDates = new Array();
      var currentDate = regressionData[0][0];
      var averageWeight = 0;
      var averageSum = 0;

    //   console.log("Current date: " + currentDate);
    //   console.log(regressionData.length);
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
    //   console.log("getAvgArray:" + averageDates);
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

        var numDays = vm.getDateDifference(new Date(vm.start_date), new Date(vm.end_date));

        var dailyGains = new Array();
        for (var i = 0; i < averageDates.length; i++) {
        //   console.log(averageDates[i][1]);

          if (i < averageDates.length - 1 && new Date(averageDates[i][0]) >= new Date(vm.start_date) && new Date(vm.end_date) >= new Date(averageDates[i + 1][0])) {
            dailyGains.push(averageDates[i + 1][1] - averageDates[i][1])
          }
        }
        var averageDailyGain = 0;
        console.log("Daily gains: " + dailyGains);
        for (var i = 0; i < dailyGains.length; i++) {
          averageDailyGain += dailyGains[i];
        }
        if (dailyGains.length === 0) {
          vm.data = "Average daily weight gain: 0";
          return 0;
        }
        else {
          console.log("adg: "+averageDailyGain+" numDay: " + numDays);
          vm.data = "Average daily weight gain: " + Math.round((averageDailyGain / numDays) * 10) / 10;
          return averageDailyGain / numDays;
        }
      }
    }

    vm.targetDateCalculator = function () {
      if (vm.targetDate == null || vm.selectedRow == null || vm.selectedRow2 == null) {
        vm.data = "Please select two rows and a target date"
        vm.targetMessage.alertType = 'alert-warning';
        vm.targetMessage.message = vm.data;
        vm.targetMessage.show = true;

        if (vm.targetDateTimeout) $timeout.cancel(vm.targetDateTimeout);
        vm.targetDateTimeout = $timeout(function () {
          vm.targetMessage.show = false;

        }, 2000);
      } else {
        vm.calculateTargetDate = true;
        var adg = vm.calculateADG();
        console.log("ADG: "+adg);

        var averageDates = vm.getAverageArray();

        console.log("Target date: " + vm.targetDate);

        console.log("adg: " + adg);


        //Current weight of animal
        var targetWeight = averageDates[averageDates.length - 1][1];
        console.log("Target weight: "+targetWeight);
        var lastWeight = new Date(averageDates[averageDates.length - 1][0]);
        console.log("Last weight: "+lastWeight);

        var numDays = vm.getDateDifference(new Date(averageDates[averageDates.length - 1][0]), new Date(vm.targetDate));

        console.log("Num Days: " + numDays);
        var gain = numDays * adg;
        targetWeight += gain;
        var formattedDate = vm.targetDate.toLocaleDateString("en-US");
        vm.data = "Target weight at " + formattedDate + " is estimated to be " + Math.round(targetWeight) + "lbs";
        vm.targetMessage.message = vm.data;
        vm.targetMessage.alertType = 'alert-success';
        vm.targetMessage.show = true;
        if (vm.targetDateTimeout) $timeout.cancel(vm.targetDateTimeout);
        vm.calculateTargetDate = false;
      }
    }

    //When two rows are selected, calculate the ADG in that date range
    vm.calculateADG = function () {

      if (vm.selectedRow == null || vm.selectedRow2 == null) {
        vm.data = "Please click two rows (start and end)"
        vm.adgMessage.alertType = 'alert-warning';
        vm.adgMessage.message = vm.data;
        vm.adgMessage.show = true;

        if (vm.calculateAdgTimeout) $timeout.cancel(vm.calculateAdgTimeout);
        vm.calculateAdgTimeout = $timeout(function () {
          vm.adgMessage.show = false;
        }, 2000);

      }
      else {
        if (vm.selectedRow < vm.selectedRow2) {
          vm.start_date = vm.selectedRow;
          vm.end_date = vm.selectedRow2;
        }
        else {
          vm.start_date = vm.selectedRow2;
          vm.end_date = vm.selectedRow;
        }

        vm.selectedRow = null;
        vm.selectedRow2 = null;

        console.log("VM: " + JSON.stringify(vm));


        var adg = vm.averageGainInRange();
        vm.adgMessage.message = vm.data;
        vm.adgMessage.alertType = 'alert-success';
        if(!vm.calculateTargetDate) {
          vm.adgMessage.show = true;
        }
        if (vm.calculateAdgTimeout) $timeout.cancel(vm.calculateAdgTimeout);

        return adg;
      }


    }

    vm.selectDates = function (date, index) {
      console.log("clicked");
      if (vm.selectedRow == date) {
        vm.selectedRow = null;
        vm.alternateSelection = false;
      } else if (vm.selectedRow2 == date) {
        vm.selectedRow2 = null;
        vm.alternateSelection = true;
      } else {
        if (vm.alternateSelection) {
          vm.selectedRow2 = date;
          vm.alternateSelection = false;
        } else {
          vm.selectedRow = date;
          vm.alternateSelection = true;
        }
      }
    }

    vm.highlight = function (date) {

      //console.log("Row1: " + vm.selectedRow);
      //console.log("Row2: " + vm.selectedRow2);
      if (date == vm.selectedRow) {
        return "selected";
      }
      if (date == vm.selectedRow2 && date != vm.selectedRow) {
        return "selected";
      }
    }

    vm.goDashboard = function () {

      $location.url("/dashboard/");
    }
    Type.get(function (data) {
      var types = {};

      for (var i = 0; i < data.data.length; i++) {
        types[data.data[i].type] = data.data[i].breeds;
      }
      vm.existingTypes = types;
    });
    vm.getBreedOptions = function () {
      vm.existingBreeds = vm.existingTypes[vm.selectTypes];
    }
  }]);

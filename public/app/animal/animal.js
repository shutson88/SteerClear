'use strict';

angular.module('app.animal', ['ngRoute', 'animalService', 'ui.bootstrap', 'filter'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/animal/:animalID', {
      templateUrl: 'animal/animal.html',
      controller: 'AnimalCtrl',
      controllerAs: 'animal'
    });
  }])

  .controller('AnimalCtrl', ['$routeParams', '$http', '$scope', function ($routeParams, $http, $scope) {
    var vm = this;

    vm.animalID = $routeParams.animalID;
    console.log(vm.animalID);

    vm.sortType = 'breed';
    vm.sortReverse = false;
    vm.searchAnimals = '';
    vm.addUserCollapsed = false;
    vm.rangeDateCollapsed = false;
    vm.selectedRow = null;
    vm.selectedRow2 = null;
    $scope.setClickedRow = function(index){
      console.log("SJIFSAJI");
      vm.selectedRow = index;
    }

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

    vm.calculate = function ($scope) {

      //console.log("Average dates"+averageDates);
      var regressionData = vm.getAverageArray();

      //console.log("Regression data:" + regressionData);
      var referenceDate = regressionData[0][0]; //take the earliest date as a referece

      for (var i = 0; i < regressionData.length; i++) {
        var second = new Date(regressionData[i][0]);
        var first = new Date(referenceDate);
        regressionData[i][0] = Math.round((second - first) / (1000 * 60 * 60 * 24));
        console.log("Days since start : " + Math.round((second - first) / (1000 * 60 * 60 * 24)));

      }
      //TODO: ensure that each date is unique so that the data can be used to form a regression line
      console.log(regressionData);

      if (vm.targetWeight) {
        console.log("target weight");

      } else if (vm.targetDate) {
        console.log("target date");

      }

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
        }
        else {
          vm.data = "Average daily weight gain: " + averageDailyGain / numDays;
        }
      }
    }


    //When two rows are selected, calculate the ADG in that date range
    vm.calculateADG = function(date, $event){

      if(vm.selectedRow == null || (vm.selectedRow != date && !$event.shiftKey)) {
        vm.selectedRow = date;
      }
      else if(vm.selectedRow != date && $event.shiftKey){
        vm.selectedRow2 = date;
      }

      if(vm.selectedRow != null && vm.selectedRow2 != null){

        vm.start_date = vm.selectedRow;
        vm.end_date = vm.selectedRow2;

        vm.selectedRow = null;
        vm.selectedRow2 = null;

        console.log("VM: "+ JSON.stringify(vm));


        vm.averageGainInRange();
      }
    }

    vm.highlight = function(date){
      console.log("Row1: " + vm.selectedRow);
      console.log("Row2: " + vm.selectedRow2);
      if(date == vm.selectedRow){
        return "selected";
      }
      if(date == vm.selectedRow2 && date != vm.selectedRow){
        return "selected";
      }
    }

  }]);


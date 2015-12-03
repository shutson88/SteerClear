angular.module('filter', [])


	.filter('myDate', function($filter) {
		var dateFilter  = $filter('date');
		return function(theDate) {
			return dateFilter(theDate, 'dd MMM yyyy');

		}
	})

	.filter('capitalize', function() {

		return function(input) {
			//console.log("Input: "+input);
			return input.toLowerCase().replace( /\b\w/g, function (m) {
				return m.toUpperCase();
			})
		}
	})

	.filter('reverse', function() {
		return function(items) {
    		return items.slice().reverse();
		}
	});

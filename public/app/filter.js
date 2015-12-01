angular.module('filter', [])


	.filter('myDate', function($filter) {
		var dateFilter  = $filter('date');
		return function(theDate) {
			return dateFilter(theDate, 'dd MMM yyyy');

		}
	})

	.filter('capitalize', function() {
		console.log("SSFSF");
		return function(input, all) {
			var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
			return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
		}
	})

	.filter('reverse', function() {
		return function(items) {
    		return items.slice().reverse();
		}
	});

angular.module('filter', [])
	
	
	.filter('myDate', function($filter) {
		var dateFilter  = $filter('date');
		return function(theDate) {
			return dateFilter(theDate, 'dd MMM yyyy');
			
		}
	
	
});
(function() {

	var app = angular.module('farmAhorro', []);

	app.controller('SearchController', ['$http', '$scope', function($http, $scope){
		this.results = [];
	}]); 
	
	app.directive("navigation", function(){
		return {
			restrict: 'E',
			templateUrl: 'navigation.html'
		};
	});

	console.log('lol');

})();


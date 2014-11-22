(function() {

	var app = angular.module('farmAhorro', []);

	app.controller('SearchController', ['$http', '$scope', function($http, $scope){
		this.results = [];
		var search = this;

		this.find = function(){
			var query = $("#search_query").val();

			search.results = [];
			if(query != undefined && query.length > 0){
				$http.get('data/results.json')
				.success( function(data){
					search.results = data;
				});
			}

		}

	}]); 
	
	app.directive("navigation", function(){
		return {
			restrict: 'E',
			templateUrl: 'navigation.html'
		};
	});

})();


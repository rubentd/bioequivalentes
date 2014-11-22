(function() {

	var app = angular.module('farmAhorro', []);

	app.controller('SearchController', ['$http', '$scope', function($http, $scope){
		this.results = [];
		this.mode = 'listing';
		this.productDetails = {};

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
		};

		this.getDetails = function(id){
			
			$('#listing').addClass('slide-left');
			$('#details').removeClass('slide-right');

			this.productDetails = {
				'reference_product': 'Zolven',
				'reference_product_lab': 'Novartis'
			};
		}

		this.goToListing = function(){
			$('#listing').removeClass('slide-left');
			$('#details').addClass('slide-right');
		}

	}]); 
	
	app.directive("navigation", function(){
		return {
			restrict: 'E',
			templateUrl: 'navigation.html'
		};
	});

	app.directive("searchBar", function(){
		return {
			restrict: 'E',
			templateUrl: 'search-bar.html'
		};
	});

	app.directive("staticInfo", function(){
		return {
			restrict: 'E',
			templateUrl: 'static-info.html'
		};
	});

})();


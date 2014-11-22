(function() {

	var app = angular.module('farmAhorro', []);
	var db = openDatabase('bioequivalents', '1.0', 'bioequivalent medicine', 1024 * 1024 * 1024);

	app.controller('SearchController', ['$http', '$scope', function($http, $scope){
		this.results = [];
		this.mode = 'listing';
		this.productDetails = {};

		var search = this;

		this.init = function(){

			db.transaction(function (tx) {
				tx.executeSql('DROP TABLE IF EXISTS bioequivalence', [], function(){
					tx.executeSql('CREATE TABLE bioequivalence ( id unique, usage TEXT, active_ingredient TEXT, reference_product TEXT, reference_product_lab TEXT, bioequivalent_product TEXT, register TEXT, bioequivalent_lab TEXT, resolution TEXT, date TEXT)', [], function(){
						$http.get('data/results.json')
						.success( function(data){
							db.transaction(function (tx) {
								$.each(data, function(index, value) {
									tx.executeSql("INSERT INTO bioequivalence (id, active_ingredient, bioequivalent_product, register, bioequivalent_lab, resolution, date, usage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", value);
								});
							});
						});
					});
				});
			});
		};

		this.find = function(){
			var query = $("#search_query").val();
			search.results = [];
			if(query != undefined && query.length > 0){
				db.transaction(function(tx) {
					tx.executeSql('SELECT * FROM bioequivalence WHERE bioequivalent_product like ?', ['%' + query + '%'], function(tx, results){
						for (var i=0; i < results.rows.length; i++){
							row = results.rows.item(i);
							search.results.push(row);
						 }
					});
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
        this.init();
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

(function() {

	$(document).ready( function(){

		$(document).on('scroll touchstart touchmove', function(){
			$(document).scrollLeft(0);
		});

	});

	var app = angular.module('farmAhorro', []);

	app.controller('SearchController', ['$http', '$scope', '$scope', function($http, $scope, $apply){
		this.results = [];
		this.mode = 'listing';
		this.productDetails = {};
		this.query = '';
		var search = this;

		this.init = function(){
			var search = this;
			search.data = {};
			$http.get('data/results.json').success(function(data) {
				for (var i=0; i < data.length; i++){
					search.data[data[i][0]] = {
						id: data[i][0],
						bioequivalent_product: data[i][2],
						bioequivalent_lab: data[i][4],
						active_ingredient: data[i][1],
						usage: data[i][7],
						price: data[i][8]
					};
				};
			});
		};

		this.find = function(){
			search.query = $("#search_query").val().toLowerCase();
			search.results = [];

			if(search.query != undefined && search.query.length > 0){
                var contains = function(str, q) { return str.toLowerCase().indexOf(q) >= 0 };
                search.results = $.map(search.data, function(row, index){
                    if (contains(row.active_ingredient, search.query)
                        || contains(row.bioequivalent_product, search.query)) {
                        return row;
                    }
                });
			}
		};

		this.getDetails = function(id){
			$('#listing').addClass('slide-left');
			$('#details').removeClass('slide-right');
			this.setProduct(id);
			$("body").animate({ scrollTop: "0px" }, 300);
			setTimeout( function(){
				search.setProductsPriceLayout();
			}, 100);

			$("#details").swipe( {
				swipeRight: function(){
					search.goToListing();
				}, 
				allowPageScroll: 'vertical'
			});
		};

		this.setProduct = function(id) {
			// getting the data of the product
			search.productDetails = search.data[id];
			search.setBioequivalents();
		};

		this.setBioequivalents = function() {
			search.bioequivalents = $.map(search.data, function(row, index) {
				if (row.active_ingredient == search.productDetails.active_ingredient && index != search.productDetails.id ) {
					return row;
				}
			});
		};

		this.goToListing = function(){
			$('#listing').removeClass('slide-left');
			$('#details').addClass('slide-right');
			$('.price-bar').css('width', '0');
		};

		this.setProductsPriceLayout = function(){
			var maxPrice = 0;
			//Get max Price
			$('.price').each( function(){
				var p = $(this).html();
				$(this).html(p.replace(',', '.'));
			});
			$('.price-bar').each( function(){
				var p = parseInt($(this).data('price'));
				$(this).width('0');
				if(p > maxPrice){
					maxPrice = p;
				}
			});
			//Set width and color in comparison
			$('.price-bar').each( function(){
				var p = $(this).data('price');
				var w = p/maxPrice * 100;
				$(this).width(w + '%');
			});
		};

		this.init();

	}]);

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

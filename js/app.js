(function() {

	$(document).ready( function(){

		$(document).on('scroll touchstart touchmove', function(){
			$(document).scrollLeft(0);
			
			var s = $(document).scrollTop();
			var h = $('.product-head-wrap').height();
			if(s > (h + 40)){
				if(!$('#details').hasClass('sticky')){
					$('#details').addClass('sticky');
				}
			}else{
				$('#details').removeClass('sticky');
			}
		});

	});

	var app = angular.module('farmAhorro', []);

	app.controller('SearchController', ['$http', '$scope', '$scope', function($http, $scope, $apply){
		this.results = [];
		this.mode = 'listing';
		this.productDetails = {};
		this.query = '';
		this.maxPrice = 0;
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
				search.getLocation();
			});
		};

		this.getLocation = function(){
			if(location.hash.indexOf('details') != -1){
				var parts = location.hash.split(':');
				if(parts.length > 0){
					var id = parts[1];	
					search.getDetails(id);
				}
			}
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
			location.href='#details:' + id;

			$('#listing').addClass('slide-left');
			$('#details').removeClass('slide-right');
			this.setProduct(id);
			$("body").animate({ scrollTop: "0px" }, 300);

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
			try {
				var mg = new RegExp("[0-9,]+ mg").exec(search.productDetails.bioequivalent_product)[0];
			} catch (e) {
				mg = '';
			}
			search.maxPrice = 0;
			search.bioequivalents = $.map(search.data, function(row, index) {
				if (row.active_ingredient == search.productDetails.active_ingredient && index != search.productDetails.id
					&& row.bioequivalent_product.indexOf(mg) >= 0) {
					if(row.price > search.maxPrice){
						search.maxPrice = row.price;
					}
					return row;
				}
			});
			if(search.productDetails.price > search.maxPrice){
				search.maxPrice = search.productDetails.price;
			}
		};

		this.goToListing = function(){
			$('#listing').removeClass('slide-left');
			$('#details').addClass('slide-right');
			$("body").animate({ scrollTop: "0px" }, 300);
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

	app.directive("product", function(){
		return {
			restrict: 'E',
			templateUrl: 'product.html'
		};
	});

})();

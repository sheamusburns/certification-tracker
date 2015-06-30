chaperone.directive('facstaff', function($timeout){
	return {
		restrict: "E",
		templateUrl: "views/facstaff.html",
		controller: "FacstaffCtrl",
		link: function(scope, element, attrs){
			$timeout(function(){
				console.log("what's happening gina");
			}, 5000);
		}
	};
});

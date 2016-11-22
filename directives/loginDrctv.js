app.directive('login', function(){
	return {
		restrict: "E",
		templateUrl: "views/login.html",
		link: function(scope, element, attrs) {
			element.hide();
		}
	};
});
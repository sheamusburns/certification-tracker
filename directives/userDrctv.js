app.directive('addUser', function(){
	return {
		restrict: "E",
		templateUrl: "views/addUser.html",
		link: function(scope, element, attrs) {
			element.hide();
			$('#addUser').on('click', function() {
					element.toggle('slide');
			});

		}
	};
});
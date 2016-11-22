app.directive('admin', function(){
	return {
		restrict: "E",
		templateUrl: "views/admin.html",
		link: function(scope, element, attrs) {
			$('#emlTxt, #emlSub').on('change', function() {
				$scope.adminRef.$save();
			});
		}
	};
});
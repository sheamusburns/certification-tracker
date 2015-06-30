var chaperone = angular.module('Chaperone', ['firebase', 'ngRoute', 'angular-momentjs', 'infinite-scroll']);


chaperone.config(function($routeProvider){
	$routeProvider
	.when('/search', {
		templateUrl: 'views/facstaff.html',
		controller: 'FacstaffCtrl'
	})
	.when('/current', {
		templateUrl: 'views/certs.html',
		controller: 'FacstaffCtrl'
	})
	.when('/upcoming', {
		templateUrl: 'views/upcoming.html'
	});
});

chaperone.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$http.get('/facstaff').success(function(data){
		var rawData = JSON.parse(data);
		var indices = [];
		var finData = [];
		var fin1Data = [];
		var refineData = function(rawData) {
			$.each(rawData, function(i, el){
    			if($.inArray(el.person_pk, indices) === -1) {
    				finData.push(el);
    				indices.push(el.person_pk);
    			} 
    		});
		};
		var reRefineData = function(finData){
			$.each(finData, function(i, el){
					fin1Data.push({
						person_pk: el.person_pk,
						nick_first_name: el.nick_first_name,
						last_name: el.last_name,
						email_1: el.email_1,
						roles: el.roles
					});
			});
			return fin1Data;
		};
		refineData(rawData);
		$scope.facstaff = reRefineData(finData);
		console.log($scope.facstaff);
	});
}]);

chaperone.controller('NavCtrl', function($scope, $location){
	$scope.isActive = function(checkLocation) {
		return checkLocation === $location.path();
	};
});

chaperone.filter('toArray', function(){
	return function(obj) {
		var newArray = [];
	  	for (var key in obj) {
	  		if (obj.hasOwnProperty(key) || obj.propertyIsEnumerable(key)) {
	  			if (Number(key) || key === 0) {
	    			newArray.push(obj[key]);
	    		}
	    	}
  		}	
  		return newArray;
  };
});


chaperone.filter('toDate', [function(){
	return function(obj) {
		return new Date(obj);
	}
}]);

// chaperone.filter('byDate', [function(){
// 	return function(obj) {
// 	  	for (var key in obj) {
// 	  		if (obj.hasOwnProperty(key) || obj.propertyIsEnumerable(key)) {
//     			if (obj[key].date) {
//     				obj[key].date = new Date(obj[key].date);
//     			}
// 	    	}
//   		}	
//   		return obj;
// 	};
// }]);



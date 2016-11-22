var app = angular.module('App', ['firebase', 'ngRoute', 'angular-momentjs', 'infinite-scroll']);

app.config(function() {
  var config = {
    apiKey: "AIzaSyCuRxQ7iJ9iCbGXNnakOyfb_E8ZALS_IBo",
    authDomain: "certifcationsdemo.firebaseapp.com",
    databaseURL: "https://certifcationsdemo.firebaseio.com",
    storageBucket: "certifcationsdemo.appspot.com",
    messagingSenderId: "445407176131" 
  };
  firebase.initializeApp(config);
  console.log('firebase initialized');
});

app.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'views/users.html',
		controller: 'UsersCtrl'
	})
	.when('/current', {
		templateUrl: 'views/certs.html',
		controller: 'UsersCtrl'
	})
	.when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'UsersCtrl'
	});
});

app.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$scope.facstaff = [];
	$scope.manualUsersAdded = [];
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
	//refineData(rawData);
	//$scope.facstaffRaw = reRefineData(finData);
	//$scope.facstaff = $scope.facstaff.concat($scope.facstaffRaw);
}]);

app.controller('NavCtrl', function($scope, $location){
	$scope.isActive = function(checkLocation) {
		return checkLocation === $location.path();
	};
});

app.filter('toArray', function(){
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


app.filter('toDate', [function(){
	return function(obj) {
		return new Date(obj);
	}
}]);

// app.filter('byDate', [function(){
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



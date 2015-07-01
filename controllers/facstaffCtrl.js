
chaperone.controller('FacstaffCtrl', ['$http', '$scope', '$firebaseObject', '$moment', '$window', function($http, $scope, $firebaseObject, $moment, $window){
	console.log("controller loading");
	var ref = new Firebase('https://blinding-inferno-9862.firebaseio.com/facstaff');
	$scope.facstaffDB = $firebaseObject(ref);

	console.log("controller still loading");
	
	$scope.limitToDisplay = 20;

  	$scope.loadMore = function() {
  		if ($scope.facstaff){
  			if ($scope.facstaff.length > $scope.limitToDisplay) {
    			$scope.limitToDisplay += 20;

    		}
    	}
	};

	$scope.saveRecord = function(user) {
		console.log(user);
		$scope.record = {
			person_pk : user.person_pk,
			first_name : user.nick_first_name,
			last_name : user.last_name,
			email_1 : user.email_1
		};
		if (!$scope.facstaffDB[$scope.record.person_pk]) {
			$scope.facstaffDB[$scope.record.person_pk] = $scope.record;
			console.log("this one's saved");
			$scope.facstaffDB.$save();
		} else {
			var person = $scope.facstaffDB[$scope.record.person_pk];
			if (!person.first_name === user.nick_first_name) person.first_name = user.nick_first_name;
			if (!person.last_name === user.last_name) person.last_name = user.last_name;
			if (!person.email_1 === user.email_1) person.email_1 = user.email_1;
			console.log("entry updated");
			$scope.facstaffDB.$save();
		}
	};

	$scope.saveCertDate = function(user, date, notes) {
		if (!date) {
			date = false;
		} else {
			date = Date.parse((new Date(date)).toDateString());
			console.log(date);
		}
		if (!notes) notes = '';
		var person = $scope.facstaffDB[user.person_pk];
		var now = date || Date.parse((new Date()).toDateString());
		var certObj = {};
		if (!person) {
			$scope.saveRecord(user);
			$scope.saveCertDate(user, date, notes);
		}
		else if (!person.certs) {
			$scope.saveRecord(user);
			person.certs = [];
			certObj.date = now;
			certObj.notes = notes;
			person.certs.push(certObj);
		} 
		else {
			var isRepeat = false;
			$scope.saveRecord(user);
			for (var i in person.certs) {
				console.log("person: " + person.certs[i].date + "\nnow: " + now);
				if (person.certs[i].date === now) isRepeat = true;
			}
			if (isRepeat !== true) {
				certObj.date = now;
				certObj.notes = notes;
				person.certs.push(certObj);
			}
			else {
				console.log("there is already a cert listed for " + (date || now));
			}
		}

		$scope.facstaffDB.$save();
		
	};

	$scope.saveMultipleCerts = function(user, certSub){
		var certArr = [
			[certSub.date1, certSub.notes1],
			[certSub.date2, certSub.notes2],
			[certSub.date3, certSub.notes3],
			[certSub.date4, certSub.notes4],
			[certSub.date5, certSub.notes5]
		];
		for (var item in certArr) {
			if (certArr[item][0]) {
				$scope.saveCertDate(user, certArr[item][0], certArr[item][1]);
			}
		}
	};

	$scope.deleteCert = function(person, cert) {
		if (confirm("Are you sure you want to delete this cert?")) {
			var arr = $scope.facstaffDB[person.person_pk].certs;
			console.log(arr);
			for (var i in arr) {
				if (arr[i].date === cert.date) {
					arr.splice(i, 1);
				}
			}
			$scope.facstaffDB.$save();
		}

	};

	$scope.checkCert = function(person_pk) {
		if ($scope.facstaffDB[person_pk] && $scope.facstaffDB[person_pk].certs){
			var today = $moment();
			var warning = $moment.duration(20, 'months');
			var expiration = $moment.duration(24, 'months');
			var latestCert = $moment($scope.getLatestCert(person_pk));
			
			if (today-latestCert > warning && today-latestCert < expiration){
				return 'yellow';
			}
			else if (today-latestCert >= expiration){
				return 'red';
			}
			else {
				return 'green';
			}
		}
		else{
			return '';
		}
	};

	$scope.getCertClass = function(person_pk) {
		switch ($scope.checkCert(person_pk)){
			case 'green': 
				return 'success';
				break;
			case 'red':
				return 'danger';
				break;
			case 'yellow':
				return 'warning';
				break;
			default: 
				return'';
		}
	};

	$scope.sortBy = function(status) {
		return function(item) {
			console.log(item);
			if ($scope.checkCert(item.person_pk) === status) {
				return true
			} 
		} 
	};

	$scope.certsFilter = '';


	var byExp = function(func) {
  		return function (o, p) {
    		var a, b;
    		var setVals = function(func, pers) {
		      switch (funct(pers.person_pk)) {
		        case 'red':
		          return 1;
		          break;
		        case 'yellow':
		          return 2;
		          break;
		        case 'green': 
		          return 3;
		          break;
		    	}
		    }
		    if (typeof o === 'object' && typeof p === 'object' && o && p) {
		      a = setVals(func, o);
		      b = setVals(func, p);
		    
		    if (a === b) {
		      return 0;
		    }
	        if (a === b) {
   		        return a < b ? -1 : 1;
		    }
		        return typeof a < typeof b ? -1 : 1;
		    } else {
		        throw {
		          name: 'Error',
		          message: 'Expected an object when sorty by ' + name
		        };
		    }
		};
	};

	$scope.hasCertToday = function(person_pk) {
		if ($scope.facstaffDB[person_pk] && $scope.facstaffDB[person_pk].certs){
			var arr = $scope.facstaffDB[person_pk].certs;
			for (key in arr) {
				if ($moment(new Date(arr[key].date)).format('MMM DD YYYY') === $moment((new Date()).toDateString()).format('MMM DD YYYY')) {
					return 'disabled'
				}
			}
		}
	};

	$scope.checkCertTodayClass = function(person_pk) {
		if ($scope.facstaffDB[person_pk] && $scope.facstaffDB[person_pk].certs){
			if ($scope.getLatestCert(person_pk) === $moment((new Date()).toDateString()).format('MMM DD YYYY')) {
				return 'disabled';
			}
		}
	};

	$scope.isLatestCert = function(cert, person_pk){
		if ($scope.getLatestCert(person_pk) === $moment(cert.date).format('MMM DD YYYY')) {
			return true;
		}
	}

	$scope.getLatestCert = function(person_pk) {
		if ($scope.facstaffDB[person_pk] && $scope.facstaffDB[person_pk].certs) {
			var tempArray = [];
			var latestCert;
			var arr = $scope.facstaffDB[person_pk].certs;
			$.each(arr, function(i, el){
				tempArray.push(el.date);
			});
			tempArray.sort(function (date1, date2) {
 				if (date1 > date2) return -1;
  				if (date1 < date2) return 1;
  				return 0;
			});
			latestCert = tempArray.shift();
			return $moment(latestCert).format('MMM DD YYYY');
		}
	};

	$scope.sortCertsBy = function(qualifier) {
		if (qualifier === 'cert_date') {
			return function(item) {
				return $moment($scope.getLatestCert(item.person_pk));
			};
		} else {
			return function(item) {
				return item.last_name;
			};
		}
	};

	$scope.sortCerts = 'last_name';

	$scope.emailCerts = function(){
		var person;
		var errorArray = [];
		console.log(Array.isArray($scope.facstaffDB));
		var emailArray = [];
		for (key in $scope.facstaffDB) {
			if (Number(key)) {
				person = $scope.facstaffDB[key];
					if ($scope.checkCert(person.person_pk) === 'red' || $scope.checkCert(person.person_pk) === 'yellow') {
					if (person.email_1) {
						emailArray.push(person.email_1);
					} else {
						errorArray.push(person.first_name + " " + person.last_name);
					}
				}
			}
		}
		console.log(emailArray.slice(','));
		var mailTo = "mailto:" + emailArray.slice(',');
		var mailSubject = "?subject=Need to Recertify CPR";
		var mailBody = "&body=Time to get recertified!";
		$window.open(mailTo + mailSubject + mailBody);
		alert("Warning: The following people do not have emails listed\n" + errorArray.slice(', '));
	};
	// $scope.certDates = function(person_pk) {
	// 	if ($scope.facstaffDB[person_pk] && $scope.facstaffDB[person_pk].certs) {
	// 		var arr = [];
	// 		var tempObj = {};
	// 		var objArr = [];
	// 		$.each($scope.facstaffDB[person_pk].certs, function(i, el){
	// 			arr.push(new Date(el.date));
	// 		});
	// 		arr.sort(function (date1, date2) {
 // 				if (date1 > date2) return -1;
 //  				if (date1 < date2) return 1;
 //  				return 0;
	// 		});
	// 		$.each(arr, function(i, el){
	// 			arr[i] = arr[i].toDateString();
	// 		});
	// 		$.each(arr, function(i, el){
	// 			var isMatch;
	// 			$scope.facstaffDB[person_pk].certs.filter(function(obj){
	// 				isMatch = obj.date === el;
	// 				if (isMatch) {
	// 					objArr.push(obj);
	// 				}
	// 			});
	// 		});
	// 		$scope.facstaffDB.$save();
	// 	}
	// };


}]);
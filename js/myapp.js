var app = angular.module("welcomeApp", ["ui.router"]).config(function($stateProvider, $urlRouterProvider) {
	 $urlRouterProvider.otherwise("home");
  $stateProvider.state("/", {
	            url: '/',
		    templateUrl: 'templates/home.html'
	});
	
  $stateProvider.state("Modal", {
    views:{
      "modal": {
        templateUrl: "modals/modal.html"
      }
    },

    onEnter: ["$state", function($state) {
      $(document).on("keyup", function(e) {
        if(e.keyCode == 27) {
          $(document).off("keyup");
          $state.go("Default");
        }
      });

      $(document).on("click", ".Modal-backdrop, .Modal-holder", function() {
        $state.go("/");
      });

      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
    abstract: true
  });

  $stateProvider.state("Modal.confirmAddToCart", {
    views: {
      "modal": {
        templateUrl: "modals/confirm.html"
      }
    }
  });

$stateProvider.state("test", {
    
       
            url: '/virtual',
            templateUrl: 'templates/testtemp.html'
       
    
  });
$stateProvider.state("home", {
    
       
            url: '/home',
            templateUrl: 'templates/home.html'
       
    
  });
$stateProvider.state("about", {
    
       
            url: '/about-us',
            templateUrl: 'templates/about.html'
       
    
  });

$stateProvider.state("contact", {
    
       
            url: '/contact-us',
            templateUrl: 'templates/contact.html',
	    controller: 'contactCtrl' // no need to use ng-controller in template file
       
    
  });
	$stateProvider.state("users", {
    
       
            url: '/users',
            templateUrl: 'templates/users.html'
       
    
  });
$stateProvider.state("list", {
    
       
            url: '/list',
            templateUrl: 'templates/list.html'
       
    
  });
	
});

app.controller("contactCtrl", function ($scope, $http) {
	$scope.result = 'hidden';
	$scope.activeClass = 'active';
    $scope.resultMessage;
    $scope.formData; //formData is an object holding the name, email, subject, and message
    $scope.submitButtonDisabled = false;
    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
    $scope.submit = function(contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
            $http({
                method  : 'POST',
                url     : 'admin/contact.php',
                data    : $.param($scope.formData),  //param method from jQuery
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            }).success(function(data){
                console.log(data);
                if (data.success) { //success comes from the return json object
                    $scope.submitButtonDisabled = true;
                    $scope.resultMessage = data.message;
                    $scope.result='bg-success';
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.resultMessage = data.message;
                    $scope.result='bg-danger';
                }
            });
        } else {
            $scope.submitButtonDisabled = false;
            $scope.resultMessage = 'Failed';
            $scope.result='bg-danger';
        }
	
    }

});

app.service('userService', function () {
    //to create unique contact id
    var uid = 1;
     
    //users array to hold list of all contacts
    var users = [{
        id: 0,
        'inputName': 'Viral',
            'inputEmail': 'hello@gmail.com'
    }];
     
    //save method create a new user if not already exists
    //else update the existing object
    this.save = function (user) {
        if (user.id == null) {
            //if this is new contact, add it in contacts array
            user.id = uid++;
            users.push(user);
        } else {
            //for existing contact, find this contact using id
            //and update it.
            for (i in users) {
                if (users[i].id == user.id) {
                    users[i] = user;
                }
            }
        }
 
    }
 
    //simply search users list for given id
    //and returns the user object if found
    this.get = function (id) {
        for (i in users) {
            if (users[i].id == id) {
                return users[i];
            }
        }
 
    }
     
    //iterate through user list and delete 
    //contact if found
    this.delete = function (id) {
        for (i in users) {
            if (users[i].id == id) {
                users.splice(i, 1);
            }
        }
    }
 
    //simply returns the user list
    this.list = function () {
        return users;
    }
});

app.controller('usersCtrl', function ($scope, userService) {
 	$scope.resultMessage;
    $scope.result = 'hidden';
    $scope.users = userService.list();
 
    $scope.saveUser = function () {
        userService.save($scope.formData);
        $scope.formData = {};
	
                    $scope.resultMessage = 'User is saved';
                    $scope.result='bg-success';
    }
 
 
    $scope.delete = function (id) {
 
        userService.delete(id);
        if ($scope.formData.id == id) $scope.formData = {};
    }
 
 
    $scope.edit = function (id) {
        $scope.formData = angular.copy(userService.get(id));
    }
});

app.service('listService', function ($q, $http) {
    //to create unique contact id
   
     
    //users array to hold list of all contacts
    var lists = '';
     
    
    
 
    //simply returns the user list
    this.list = function () {
        var deferred = $q.defer();
           
                $http.get('admin/data.php').then(function(response) {
			console.log(response.data);
			deferred.resolve(response.data);
                });
            
            return deferred.promise;

	
    }
});

app.controller('listCtrl', function ($scope, listService) {
 	
    $scope.lists = [];
    listService.list().then( 
		function(res){
                	console.log(res);
			$scope.lists =  res;
            	});
 
   console.log($scope.lists);
});

var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/productListPartial.html"
    })
    .when("/editProduct/:id", {
        templateUrl : "partials/productEditPartial.html",
    })
    .when("/deleteProduct/:id", {
        templateUrl : "partials/productDeletePartial.html"
    });
});

/**
/* Controller for insert of data. The parent controller is 'productListController'
/* Send an alert upon successful or failed insert
/* 
*/
app.controller('productInsertController',function($scope, $http){
	
	$scope.save = function(){
		let name = $scope.name;
		let category = $scope.category;
		//insert data if the input are not empty
		if(name.length>0 && category.length>0){
			$http.defaults.headers.post = { 'Content-Type' : 'application/json' };
			//set json header
			var parameter = JSON.stringify({name:name, category:category});
			//post
			$http.post("http://localhost:8000/api",parameter)
		    .then(function (response) {
		    	if(response.data.message == "success"){
		    		alert('Insert Successful');
		    		//refrest product list in parent controller
		    		$scope.listProduct();
		    	} else {
		    		alert('Insert Failed!')
		    		console.log(response.data);
		    	}
		    });
		} else {
			alert('Please enter all fields!');
		}
	}
});

/**
/* Controller for listing of data.
/* 
*/
app.controller('productListController', function($scope, $location, $http) {
	this.$onInit = function () {
		$scope.listProduct();
	}
	//get product list
	$scope.listProduct = function(){
		$http.get("http://localhost:8000/api")
	    .then(function (response) {
	    	$scope.products = response.data.products; 
	    });
	}
	//button click to redirect to edit product page
	$scope.edit = function(event){
		var id = event.currentTarget.value;
		$location.path('editProduct/' + id);
	}
	//button click to redirect to delete page
	$scope.delete = function(event){
		var id = event.currentTarget.value;
		$location.path('deleteProduct/' + id);
	}

});

/**
/* Controller for edit of a product data
/* 
*/
app.controller('productEditController', function($scope, $http, $routeParams, $location) {
	var id = $routeParams.id;
	this.$onInit = function () {
	    $http.get("http://localhost:8000/api/"+id)
	    .then(function (response) {
	    	$scope.product = response.data.products;
	    	$scope.name = $scope.product.name;	 
	    	$scope.category = $scope.product.category;	   	
	    });  
	}

	$scope.update = function(){
		let name = $scope.name;
		let category = $scope.category;
		//insert data if the input are not empty
		if(name.length>0 && category.length>0){
			//set json header and data
			$http.defaults.headers.put["Content-Type"] = "application/json";
			var parameter = JSON.stringify({name:name, category:category});
			//post
			$http.put("http://localhost:8000/api/"+id,parameter)
		    .then(function (response) {
		    	if(response.data.message == "success"){
		    		alert('Update Successful');
		    		//redirect to list page
		    		$location.path('/');
		    	} else {
		    		alert('Update Failed!')
		    		console.log(response.data);
		    	}
		    });
		} else {
			alert('Please enter all fields!');
		}
	}
	
});

/**
/* Controller for deletion of a product data.
/* 
*/
app.controller('productDeleteController', function($scope, $http, $routeParams, $location) {
	var id = $routeParams.id;
	this.$onInit = function () {
	    $http.get("http://localhost:8000/api/"+id)
	    .then(function (response) {
	    	$scope.product = response.data.products; 	    	
	    });  
	}

	$scope.delete = function(){
		$http.delete("http://localhost:8000/api/"+id)
		.then(function(response){
				if(response.data.message == "success"){
		    		alert('Delete Successful');
		    		//redirect to list page
		    		$location.path('/');
		    	} else {
		    		alert('Delete Failed!')
		    		console.log(response.data);
		    	}
		});
	}
});
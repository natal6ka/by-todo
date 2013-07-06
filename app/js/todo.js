var app = angular.module('todo', []);

app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/todo-list.html'
		}).when('/delete/:taskId', {
			templateUrl: 'views/delete-task.html'
		})
}]);

app.service('sharedProperties', function() {
    var currentId = '';
    var objectValue = {
        data: 'test object value'
    };
    
    return {
        getCurrentId: function() {
            return currentId;
        },
        setCurrentId: function(value) {
            currentId = value;
        },
        getObject: function() {
            return objectValue;
        }
    }
});

app.controller('ToDoCtrl', function($scope, $http, $route, sharedProperties){
	
	$scope.getCurrentId = function(id){
		sharedProperties.setCurrentId(id);
	}
	
	$http({
		method : 'GET',
		url : '/tasks'
	}).
	success(function(data, status, headers, config) {
		$scope.tasks = data;
	}).
	error(function(data, status, headers, config) {
		alert('error');
	});
	
	$scope.priority = 'priority.high';
	
	$scope.task = {};
	$scope.addTask = function() {
	
		$scope.task.status = 'true';
		
		if($scope.task.priority.low){
			$scope.task.priority = 'warning';
		}else if($scope.task.priority.medium){
			$scope.task.priority = 'info';
		}else{
			$scope.task.priority = 'error';
		}
		
        $http({
            method : 'POST',
            url : '/tasks',
            data : $scope.task
        }).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data, status, headers, config) {
			alert('error');
		});
    }
	
	$scope.doneTask = function(id, priority){
		
		$scope.task = {};
		$scope.task.priority = 'success';
		$scope.task.oldPriority = priority;
		$scope.task.status = '';
		
		$http({
            method : 'PUT',
            url : '/tasks/' + id,
            data : $scope.task
        }).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data, status, headers, config) {
			alert('error');
		});
	}
	
	$scope.undoDoneTask = function(id){
		
		$http({
            method : 'GET',
            url : '/tasks/' + id,
			params : {id: id, status: 'true'}
        }).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data, status, headers, config) {
			alert('error');
		});
	}
	
});

app.controller('DeleteTaskCtrl', function($scope, $http, $route, sharedProperties){
	
	$scope.deleteTask = function() {
	$scope.id = sharedProperties.getCurrentId();
	
		$http({
            method : 'DELETE',
            url : '/tasks/' + $scope.id,
			data : $scope.id
        }).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data, status, headers, config) {
			alert('error');
		});
	}
});
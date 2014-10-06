var scotchApp = angular.module('scotchApp', ['ngRoute','ui.sortable']);

scotchApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'pages/login.html',
        controller  : 'mainController'
    }) .when('/register', {
        templateUrl : 'pages/register.html',
        controller  : 'registerController'
    }) .when('/todo', {
        templateUrl : 'pages/todo.html',
        controller  : 'todoController'
    }) .when('/logout', {
        templateUrl : 'pages/logout.html',
        controller  : 'logoutController'
    });
});

scotchApp.controller('mainController', function($scope) {
    $scope.login = function(){
        console.log($scope.email);
        console.log($scope.password);
        Todo.startSession({
            email:    $scope.email,
            password: $scope.password,
            success:  function(user) {
//                alert('login success!');
                window.location.href = "./#todo";
            },
            error:    function(xhr)  {
                alert('login error!');
            }
        });
    }
});

scotchApp.controller('logoutController', function($scope, $timeout){
    var options = {
        success: function(){
            console.log("logout success.");
            //window.location.href = "./";
        },
        error: function(){
            alert("logout error.");       
        }
    };

    Todo.endSession(options);
    $scope.countDown = 5;
    $scope.onTimeout = function(){
        $scope.countDown--;
        $("#countDown").text($scope.countDown);
        if($scope.countDown == 0){
            $timeout.cancel(mytimeout);
            window.location.href = "./";
        }else{
            mytimeout = $timeout($scope.onTimeout,1000);
        }
    }
    var mytimeout = $timeout($scope.onTimeout,1000);
});

scotchApp.controller('registerController', function($scope) {
    $scope.signup = function(){
        var option = {
            email: $scope.email,
            password:$scope.password,
            success: function(){
                //alert('sign up success!');
                window.location.href = "./"; 
            },
            error:   function(xhr)  {
                alert('sign up error!');
            }
        };
        Todo.createUser (option);
    }
});

scotchApp.controller('todoController', function($scope) {
    function initTodos( todos){
        $scope.todos = todos;
        $scope.$apply();
    };

    $scope.todos = []; 
    
    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.is_complete ? 0 : 1;
        });
        console.log("count = "+count);
        return count;
    };

    Todo.loadTodos({
        success: initTodos,
        error:   function(xhr)   { alert('todo load error!') }
    });
   
    $scope.update = function(todo){
        var options = {
            todoId:todo.id,
            data: {is_complete: todo.is_complete},
            success: function(todo) {
                for(var i = 0; i < $scope.todos.length; ++i){
                    if($scope.todos[i].id == todo.id){
                        $scope.todos[i].is_complete = todo.is_complete;
                    }
                }
                $scope.$apply();
            },
            error:   function(xhr)  { alert('todo update error!') }
        };
        Todo.updateTodo(options);
    };

    $scope.addTodo = function() {
        var options = {
            todo: {description: $scope.todoText, is_complete: false},
            success: function(elem){ 
                console.log("success");
                $scope.todos.push({description:elem.description, is_complete: elem.is_complete, id:elem.id});
                $scope.todoText = ''; 
                $scope.$apply();
            },
            error: function(){
                alert("add todo error.");       
            }
        }
        Todo.addTodo(options);
    };
});


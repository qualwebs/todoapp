var todoApp = angular.module('todoApp', ['ngRoute','ngResource']);
var BASE_URL = "http://qualwebs.com/todoapp/server/";
var SITE_URL = "http://qualwebs.com/todoapp/#/";
todoApp.config(['$routeProvider', function($routeProvider) {
    
    $routeProvider.
    when('/todo', {
        templateUrl: 'templates/todo.html',
        controller: 'todoController'
    }).
    when('/', {
        templateUrl: 'templates/login.html',
        controller: 'loginController'
    }).
    otherwise({
        redirectTo: '/'
    });

}]);

todoApp.factory('LoginService', function ($resource) {
    var data = $resource(BASE_URL+'api/v1/login', {}, {
        post: {method:'POST'}
    });
    return data;
});

todoApp.factory('TodoService', function ($resource,$rootScope) {
    // var tempToken = localStorage.getItem("token");

    // var data = $resource(BASE_URL+'api/v1/todo/:token/:id', {}, {
    //     query: {method:'GET', headers:{'Token':tempToken}},
    //     post: {method:'POST', headers:{'Token':tempToken}},
    //     update: {method:'PUT', params: {id: '@id'}, headers:{'Token':tempToken}},
    //     remove: {method:'DELETE', params: {id: '@id'}, headers:{'Token':tempToken}}
    // });

    // $rootScope.$watch('tempToken',function(){
    //     data = $resource(BASE_URL+'api/v1/todo/:token/:id', {}, {
    //         query: {method:'GET', headers:{'Token':$rootScope.tempToken}},
    //         post: {method:'POST', headers:{'Token':$rootScope.tempToken}},
    //         update: {method:'PUT', params: {id: '@id'}, headers:{'Token':$rootScope.tempToken}},
    //         remove: {method:'DELETE', params: {id: '@id'}, headers:{'Token':$rootScope.tempToken}}
    //     });
    //     console.log(data);
    //     console.log($rootScope.tempToken);
    // });

    return {
        action : function (token) {
            return $resource(BASE_URL+'api/v1/todo/:token/:id', {}, {
                query: {method:'GET', headers:{'Token':token}},
                post: {method:'POST', headers:{'Token':token}},
                update: {method:'PUT', params: {id: '@id'}, headers:{'Token':token}},
                remove: {method:'DELETE', params: {id: '@id'}, headers:{'Token':token}}
            });
        }
    };

    // return data;
});

todoApp.controller('rootController', ['$scope', '$http', '$rootScope', '$location', 'TodoService', function ($scope, $http, $rootScope, $location, TodoService) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if(next == SITE_URL+"todo")
        {
            var token = localStorage.getItem("token");
            if(token == "" || token == "undefined")
            {
                window.location.href = SITE_URL;
            }
        }
    });
}]);
todoApp.controller('loginController', ['$scope', '$http', '$location', 'LoginService','$rootScope', function ($scope, $http, $location, LoginService, $rootScope) {

    $scope.login = function()
    {
        $scope.errorMessage = "";
        var query = LoginService.post({}, {email: $scope.email, password: $scope.password});
        query.$promise.then(function(data) {
            if(data.status == 200)
            {
                localStorage.setItem("token", data.token);
                $rootScope.tempToken = data.token;
                window.location.href = SITE_URL+"todo";
            }
            else
            {
                $scope.errorMessage = data.message;
            }
        });
    }

}]);


todoApp.controller('todoController', ['$scope', '$http', '$location', 'TodoService', '$rootScope', function ($scope, $http, $location, TodoService, $rootScope) {
    
    $scope.addMessage = function()
    {
        var query = TodoService.action(localStorage.getItem("token")).post({}, {message: $scope.addtext});
        query.$promise.then(function(data) {
            if(data.status == 200)
            {
                $scope.getMessage();
                $scope.addtext = "";
            }
            else if(data.status == 498)
            {
                window.location.href = SITE_URL;
            }
        });
    }

    $scope.getMessage = function()
    {
        var query = TodoService.action(localStorage.getItem("token")).query({}, {});
        query.$promise.then(function(data) {
            if(data.status == 200)
            {
                $scope.messages = data.messages;
            }
            else if(data.status == 498)
            {
                // window.location.href = SITE_URL;
            }
        });
    }

    $scope.updateMessage = function()
    {
        var messageId = $scope.editId;
        var query = TodoService.action(localStorage.getItem("token")).update({id:messageId}, {message: $scope.updateText});
        query.$promise.then(function(data) {
            if(data.status == 200)
            {
                $scope.getMessage();
                $scope.addtext = "";
                $scope.updateText = "";
                $scope.updateShow = false;
            }
            else if(data.status == 498)
            {
                // window.location.href = SITE_URL;
            }
        });
    }

    $scope.deleteMessage = function(messageId)
    {
        var query = TodoService.action(localStorage.getItem("token")).remove({id:messageId}, {message: $scope.addtext});
        query.$promise.then(function(data) {
            if(data.status == 200)
            {
                $scope.getMessage();
            }
            else if(data.status == 498)
            {
                // window.location.href = SITE_URL;
            }
        });
    }

    $scope.logout = function()
    {
        localStorage.setItem("token", "");
        window.location.href = SITE_URL;
    }

    $scope.setUpdate = function(id,msg){
        $scope.editId = id;
        $scope.updateText = msg;
        $scope.updateShow = true;
    }
    $scope.cancelUpdate = function(){
        $scope.updateShow = false;
    }
}]);
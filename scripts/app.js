'use strict';

var module = angular.module('testApp', ['ngRoute','ui.bootstrap']);
module.factory('todoStorage', function () {
   var STORAGE_ID = 'todos-angularjs-perf';

   return {
      get: function () {
         return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      },

      put: function (todos) {
         localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
      }
   };
});
module.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/main.html'
      })
      .when('/todo', {
        templateUrl: 'templates/todo.html',
        controller: 'ToDoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

module.controller('ToDoCtrl', function ($scope, todoStorage) {
   var todos = $scope.todos = todoStorage.get();
   $scope.message = 'This is Add new order screen';
   $scope.newTodo = '';
   $scope.addTodo = function () {
      var newTodo = $scope.newTodo.trim();
      if (newTodo.length === 0) {
         return;
      }

      todos.push({
         title: newTodo,
         completed: false
      });
      todoStorage.put(todos);

      $scope.newTodo = '';
   };
   $scope.editTodo = function (todo) {
      $scope.editedTodo = todo;
      $scope.originalTodo = angular.extend({}, todo);
   };
   $scope.doneEditing = function (todo) {
      $scope.editedTodo = null;
      todo.title = todo.title.trim();

      if (!todo.title) {
         $scope.removeTodo(todo);
      }

      todoStorage.put(todos);
   };
   $scope.removeTodo = function (todo) {
      todos.splice(todos.indexOf(todo), 1);
      todoStorage.put(todos);
   };
   $scope.todoCompleted = function (todo) {
      todoStorage.put(todos);
   };
});

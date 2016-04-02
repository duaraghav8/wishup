function TodoCtrl($scope, $location, $http) {
  function getServerUrl () {
    return ($location.protocol() + "://" + $location.host() + ":" + $location.port());
  }

  $scope.todos = [];
  $scope.markAll = false;

  $http
    .get (getServerUrl () + '/api/items', {withCredentials: true})
    .then (
      function (res) {
        for (var item in res.data) {
          $scope.todos.push ({
            text: res.data [item].description,
            location: res.data [item].location,
            id: res.data [item].id,
            deadline: res.data [item].deadline,
            done: res.data [item].done
          });
        }
      },
      function (err) { console.info (err); }
    );
    
  $scope.addTodo = function() {
      var deadlineValue = document.getElementsByClassName ('form-control') [0].value,
        address = document.getElementById('us2-address').value,
        newItem = {
          description: $scope.todoText,
          done: false,
          deadline: deadlineValue,
          location: address,
        };

      if(event.keyCode == 13 && $scope.todoText && deadlineValue) {
          $http
            .post (getServerUrl () + '/api/create', newItem)
            .then (
              function (res) {
                newItem.text = newItem.description;
                newItem.id = res.data.id;
                delete newItem.description;
                console.log (newItem.id);
                $scope.todos.push (newItem);
              },
              function (err) {}
            );

            $scope.todoText = '';
            document.getElementsByClassName ('form-control') [0].value = '';
      }
  };

  $scope.isTodo = function(){
      return $scope.todos.length > 0;  
  }

  $scope.toggleEditMode = function(){
      $(event.target).closest('li').toggleClass('editing');
  };

  $scope.editOnEnter = function(todo){
      if(event.keyCode == 13 && todo.text){
          $scope.toggleEditMode();
      }
  };
    
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  $scope.hasDone = function() {
      return ($scope.todos.length != $scope.remaining());
  }    
    
  $scope.itemText = function() {
      return ($scope.todos.length - $scope.remaining() > 1) ? "items" : "item";     
  };
      
  $scope.toggleMarkAll = function() {
      angular.forEach($scope.todos, function(todo) {
        if (!todo.done) {
          $scope.toggle_status (todo.id);
          //console.log (todo.id);
          todo.done = $scope.markAll;
        }
      });
  };
  
  $scope.clear = function() {
    var oldTodos = $scope.todos;

    angular.forEach (oldTodos, function (todo) {
      if (todo.done) { $scope.delete (todo.id); }
    });

    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };

  $scope.toggle_status = function (id) {
    $http
      .get (getServerUrl () + '/api/toggle_status/' + id, {withCredentials: true})
      .then (
        function (res) { console.log (res.data); },
        function (err) { console.log (err); }
      );
  };

  $scope.delete = function (id) {
    $http
      .delete (getServerUrl () + '/api/delete/' + id, {withCredentials: true})
      .then (
        function (res) { console.log (res.data); },
        function (err) { console.log (err); }
      );
  };
    
}
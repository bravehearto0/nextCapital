Todo = {
  USER: null,

  config: {
    host: 'http://recruiting-api.nextcapital.com'
  },

  endSession: function(options) {
    var success = options.success;
    var error   = options.error;

    if(Todo.USER) {
      var userId   = Todo.USER.id;
      var apiToken = Todo.USER.api_token;

      $.ajax([Todo.config.host, 'users/sign_out' ].join('/'),{
        data: { user_id: userId, api_token: apiToken },
        type: 'DELETE',
        success: success,
        error:   error
      });
      Todo.USER = null;
    } else {
      success();
    }
  },

  startSession: function(options) {
    this._postUser(options, [Todo.config.host, 'users/sign_in' ].join('/'));
  },

  loadTodos: function(options) {
    var apiToken = Todo.USER.api_token;
    var userId   = Todo.USER.id;
    var success  = options.success;
    var error    = options.error;

    $.ajax([Todo.config.host, 'users', userId, 'todos' ].join('/'), {
      data: { api_token: apiToken },
      success: success,
      error:   error
    });
  },

  updateTodo: function(options) {
    var todoId   = options.todoId;
    var data     = options.data;
    var success  = options.success;
    var error    = options.error;
    var apiToken = Todo.USER.api_token;
    var userId   = Todo.USER.id;

    $.ajax([Todo.config.host, 'users', userId, 'todos', todoId ].join('/'), {
      data:    { todo: data, api_token: apiToken },
      type:    'PUT',
      success: success,
      error:   error
    });
  },

  addTodo: function(options){
    var userId = Todo.USER.id;
    var apiToken = Todo.USER.api_token;
    var data = options.todo;
    var success = options.success;
    var error = options.error;
     $.ajax([Todo.config.host, 'users', userId, 'todos' ].join('/'), {
         data:  {todo:data, api_token: apiToken},
         type:  'POST',
         success: success,
         error:   error
     });
  },

  createUser: function(options) {
    this._postUser(options, [Todo.config.host, 'users' ].join('/'));
  },

  _postUser: function(options, route) {
    var email    = options.email;
    var password = options.password;
    var success  = options.success;
    var error    = options.error;

    var successCallback = function(user) {
      Todo.USER = user;

      if(success) {
        success(user);
      }
    };

    $.ajax(route, {
      data:    { email: email, password: password },
      type:    'POST',
      success: successCallback,
      error:   error
    });
  }

};


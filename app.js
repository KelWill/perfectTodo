var Todo = Backbone.Model.extend({
  initialize: function(){
    this.set('completed', false);
  },

  complete: function(){
    this.set('completed', true);
  },

  destroy: function(){
    this.trigger('destroy', this);
  }
});

var TodoList = Backbone.Collection.extend({
  initialize: function(){
    this.on('destroy', this.destroyModel);
  },
  destroyModel: function(model){
    this.remove(model);
  }
});

var TodoView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  events: {
    'click span.done': 'complete',
    'click span.cancel': 'destroy'
  },
  complete: function(){
    this.$el.css('text-decoration', 'line-through');
    this.model.complete();
  },
  destroy: function(){
    this.$el.remove();
    this.model.destroy();
  },
  tagName: 'li',
  className: 'todo list-group-item',
  template: _.template("<span class = 'pull-left glyphicon glyphicon-check done'></span> <%= todo %><span class = 'pull-right glyphicon glyphicon-trash float-right cancel'></span>"),
  render: function(){
    this.$el.append(this.template(this.model.attributes));
    return this;
  }
});

var TodoListView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.renderOne, this);
    this.render();
  },
  events: {
    'click button': 'addOne'
  },
  addOne: function(){
    var newTodoText = this.$el.find('#newTodo').val();
    this.$el.find('#newTodo').val('');
    this.collection.add(new Todo({todo: newTodoText}));
  },
  renderOne: function(todo){
    this.$el.append(new TodoView({model: todo}).el);
  },
  tagName: 'ul',
  className: 'list-group',
  render: function(){
    this.$el.append("<form action = '#'><input type = 'text' id = 'newTodo'></input><button>Add</button></form>");
    $('#container').append(this.$el);
  }
});

$(document).ready(function(){
  var todoList = new TodoList();
  var todoListView = new TodoListView({collection: todoList});
});

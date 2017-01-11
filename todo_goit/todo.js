$(function () {
    var Todo = function () {

        this.model = [
            {text: 'Купить молока'},
            {text: 'Надеть пиджак'},
            {text: 'Покататься'}
        ];

        this.inputField = $('.task-form__text');

        this.form = $('.task-form');

        this.todoList = $('.table__body');

        this.init();
    };

    Todo.prototype.getLength = function() {
      return this.model.length;
    };

    Todo.prototype.appendRenderItem = function(index, item) {
        this.todoList.append(this.getItemHtml(index, item.text));
    };

    Todo.prototype.renderList = function() {
        var list = '';
        $.each(this.model, function(index, item) {
            list += this.getItemHtml(index + 1, item.text);
        }.bind(this));
        this.todoList.html(list);
    };


    Todo.prototype.addItem = function(todoText) {
        var newTodo = {text: todoText};
        this.model.push(newTodo);
        this.appendRenderItem(this.getLength(), newTodo);
    };

    Todo.prototype.onFormSubmit = function(e) {
        e.preventDefault();
        this.addItem(this.inputField.val());
        this.form.trigger('reset');
    };

    Todo.prototype.removeItem = function(index) {
        this.model.splice(index, 1);
        this.renderList();
    };

    Todo.prototype.getItemHtml = function(position, item) {
        var tmpl = '<tr><th>:position</th><td>:text</td><td><button type="button" class="btn btn-info">&#8593</button></td><td><button type="button" data-index=":index" class="btn btn-danger">x</button></td></tr>';
        return tmpl.replace(/:position/gi, position).replace(/:text/gi, item).replace(/:index/gi, position - 1);
    };

    Todo.prototype.init = function(){
        this.form.submit(this.onFormSubmit.bind(this));
        this.renderList();
        this.todoList.on('click', '.btn-danger', function(e) {
            var index = $(e.target).data('index');
            this.removeItem(index);
        }.bind(this));
    };

    window.todo = new Todo();
});
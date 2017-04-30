$(function () {
    var Todo = function () {



        this.model = [

        ];

        this.inputField = $('.task-form__text');

        this.form = $('.task-form');

        this.todoList = $('.table__body');

        this.init();
    };

    Todo.prototype.fillModel = function() {
        if (!('model' in localStorage)) return;
        this.model = JSON.parse(localStorage.getItem('model'));
    };

    Todo.prototype.saveModel = function() {
        localStorage.model = JSON.stringify(this.model);
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
        this.saveModel();
    };

    Todo.prototype.onFormSubmit = function(e) {
        e.preventDefault();
        var todoText = this.inputField.val();
        this.form.find('input[type="text"]').focus();
        if (!todoText) return;
        this.addItem(todoText);
        this.form.trigger('reset').focus();

    };

    Todo.prototype.removeItem = function(index) {
        this.model.splice(index, 1);
        this.renderList();
        this.saveModel();
    };

    Todo.prototype.replaceItem = function(index, nextIndex) {
        console.log(index, nextIndex);
        if (this.model[nextIndex] == undefined) return;
        var tmp = this.model[index];
        this.model[index] = this.model[nextIndex];
        this.model[nextIndex] = tmp;
        this.renderList();
        this.saveModel();
    };

    Todo.prototype.getItemHtml = function(position, item) {
        var tmpl = '<tr><td>:position</td><td>:text</td><td><button type="button" class="btn btn-info move-down">&#8595</button></td><td><button type="button" class="btn btn-info move-up">&#8593</button></td><td><button type="button" data-index=":index" class="btn btn-danger">x</button></td></tr>';
        return tmpl.replace(/:position/gi, position).replace(/:text/gi, item).replace(/:index/gi, position - 1);
    };

    Todo.prototype.init = function(){
        this.fillModel();
        this.form.submit(this.onFormSubmit.bind(this));
        this.renderList();
        var __self = this;
        this.todoList.on('click', '.btn-danger', function(e) {
            var tr = $(e.target).parent().parent().get(0);
            var tb = $('tbody tr');
            var index = tb.index(tr);
            __self.removeItem(index);

        });
        this.todoList.on('click', '.move-down, .move-up', function(e) {
            var tr = $(e.target).parent().parent().get(0);
            var tb = $('tbody tr');
            var index = tb.index(tr);
            var nextIndex = $(e.target).hasClass('move-down') ? index + 1 : index - 1;
            __self.replaceItem(index, nextIndex);
        });
    };

    window.todo = new Todo();
});
var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      // All of this...
      // var properties = {};
      // properties.name = task_name;
      // var task = new Task(properties);
      // self.tasks.push(task);

      // Is equivalent to these two line
      var task = new Task({ name: task_name });
      self.tasks.push(task);

      if (save()) {
        appendToList(task);
        return true;
      }
      else {
        return false;
      }
    }

    function appendToList(task) {
      // Grab a copy of the list item template.
      var li = $('#list_item_template').clone();
      li.removeAttr('id');

      // Add the task name to the LI's label.
      li.find('label').text(task.name);

      // Unhide the new LI.
      li.removeClass('hidden');

      // Activate the delete button.
      li.find('button.delete').click(function() {
        self.tasks.splice(self.tasks.indexOf(task), 1);
        save();
        li.remove();
      });


      $('body').on('click', 'button.edit', function() {

      });


      // Activate the edit button.
      li.find('button.edit').click(task, createEditForm);

      $('#tasks').append(li);
    }

    function createEditForm(ev) {
      var task = ev.data;
      var li = $(this).closest('li');

      // Make the task name editable
      var edit_form = $('#edit_form_template').clone();
      edit_form.removeAttr('id');
      var name_field = edit_form.find('.edit-task-name');
      name_field.data('task-id', task.id);
      name_field.val(task.name);
      edit_form.removeClass('hidden');

      li.find('label').replaceWith(edit_form);
      name_field.focus().select();
    }

    function showFormError(form) {
      // add message inside alert div
      $(form).find('.alert')
        .html('Aww, <em>cuss</em>! Something went wrong')
        .removeClass('hidden');
    }

    function supportsLocalStorage() {
      try {
         return 'localStorage' in window && window.localStorage !== null;
      }
      catch(err) {
        return false;
      }
    }

    function load() {
      if (supportsLocalStorage() && localStorage.tasks) {
        var task;
        var task_objects = JSON.parse(localStorage.tasks);
        $.each(task_objects, function(index, task_properties) {
          task = new Task(task_properties);
          self.tasks.push(task);
          appendToList(task);
        });
      }
    }

    function save() {
      if (supportsLocalStorage()) {
        return (localStorage.tasks = JSON.stringify(self.tasks));
      }
      else {
        return false;
      }
    }

    load();

    $('form#new_task').on('submit', function(ev) {
      ev.preventDefault();
      var field = $(this.task_name);
      var task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      }
      else {
        showFormError(this);
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();

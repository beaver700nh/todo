var globals = {
  delete_mode: false,
};

function delete_mode_setter(value) {
  return function (event) {
    if (value && event.ctrlKey) {
      $("body").addClass("deleting");
      globals.delete_mode = true;
    }
    else if (!value) {
      $("body").removeClass("deleting");
      globals.delete_mode = false;
    }
  }
}

function list_remover() {
  console.log($(this).find("li.list:hover").length);
  if (globals.delete_mode && ($(this).find("li.list:hover").length === 0)) {
    window.setTimeout(() => { $(this).remove(); }, 500);
  }
}

function list_item_remover(_, elem) {
  if ($(elem).text() === "") {
    $(elem).parent().remove();
  }
}

function list_adder() {
  let $list = $("#list-template").clone();
  $list.removeAttr("id");
  $list.click(list_remover);
  $list.find(".add-list").click(list_adder);
  $list.find(".add-list-item").click(list_item_adder);
  $list.insertBefore($(this));
}

function list_item_adder() {
  let $item = $("#list-item-template").clone();
  $item.removeAttr("id");
  $item.insertBefore($(this));
}

function setup() {
  /* Enter delete mode when [CTRL] pressed */
  $(document).keydown(delete_mode_setter(true));
  $(document).keyup(delete_mode_setter(false));

  /* Autoremove empty list items */
  window.setInterval(
    () => { $(".list-item > span").each(list_item_remover); }, 1000
  );

  /* Callback for toplevel "Add List" button */
  $(".add-list.toplevel").click(list_adder);
}

$(document).ready(setup);

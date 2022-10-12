var globals = {
  delete_mode: false,
  getting_save_filename: false,
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

function sanitize(filename) {
  let sanitized = filename
    .replace(/[^0-9A-Z_\-\.]/gi, "_")
    .replace(/_{2,}/g, "_");

  if (!/\.[0-9A-Z]+$/gi.test(sanitized)) {
    sanitized += ".json";
  }

  return sanitized;
}

function download(name, url) {
  let $a = $(`<a href="${url}" download="${name}"></a>`);
  $a.css("display", "none");
  $("body").append($a);
  $a[0].click();
  $a.remove();
}

function saver() {
  if (globals.getting_save_filename) {
    let name = sanitize($("#fname").val().trim());
    let data = new TextEncoder().encode(JSON.stringify(encode_lists()));
    let blob = new Blob([data], {type: "octet/stream"});
    let url = window.URL.createObjectURL(blob);

    download(name, url);

    $("#form").removeClass("show");
    globals.getting_save_filename = false;
  }
  else {
    $("#form").addClass("show");
    globals.getting_save_filename = true;
  }
}

function encode_lists($elem) {
  if (!$elem) $elem = $("body");

  let $sublist = $elem.children("ul");
  let title = $elem.children("span").first().text();

  // This is a list item, not a list
  if ($sublist.length === 0) return title;

  let encoded = {title: title, items: []};

  $sublist.children("li:not(#list-template)").each(
    function () { encoded.items.push(encode_lists($(this))); }
  );

  return encoded;
}

function loader() {
  ///
}

function decode_lists() {
  ///
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

  /* Callback for save/load buttons */
  $("#save").click(saver);
  $("#load").click(loader);
}

$(document).ready(setup);

/****************************************************************************************************
 *
 * wenn die html seite komplett geladen ist, werden die todo einträge von der api geholt
 *
 ***************************************************************************************************/
$(document).ready(function () {
  loadTodos();
});

/****************************************************************************************************
 *
 * dynamisches reagieren auf checkbox änderungen > damit werden die einträge aktualisiert
 *
 ***************************************************************************************************/
$(document).on("change", ".tddCheckbox", function () {
  let id = $(this).prop("value");
  let checked = $(this).prop("checked");

  updateTodoItem(id, checked);
});

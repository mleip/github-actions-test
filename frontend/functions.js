/****************************************************************************************************
 *
 * API URL die in allen funktionen genutzt wird
 * kann durch die production oder development API entsprechend ausgetauscht werden
 *
 ***************************************************************************************************/
const API_URL="https://api.techstarter.dev";
/****************************************************************************************************
 *
 * aktualisieren eines eintrags mit ID und Zustand und liste aktualisieren
 *
 ***************************************************************************************************/
function updateTodoItem(id, done) {
  $.ajax({
      url: API_URL + "/todos",
      crossDomain: true,
      method: "PUT",
      data: JSON.stringify({
          id: id,
          done: done,
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
  })
  .done(function(data) {
      updateListe(data)
  });;;
}

/****************************************************************************************************
 *
 * Eintrag hinzufügen und liste aktualisieren
 *
 ***************************************************************************************************/
function addTodo(){
  let todoItem = $("#txtTodoItem").val();

  $.ajax({
    method: "POST",
    url: API_URL + "/todos",
    data: JSON.stringify({
      name: todoItem,
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  }).done(function (data) {
    updateListe(data);
  });
}

/****************************************************************************************************
 *
 * Eintrag löschen und liste aktualisieren
 *
 ***************************************************************************************************/
function deleteTodoItem(id) {
  $.ajax({
          url: API_URL + "/todos/" + id,
          crossDomain: true,
          method: "DELETE",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
      })
      .done(function(data) {
          updateListe(data)
      });;
}

/****************************************************************************************************
 *
 * Liste basierend auf dem payload erneuern (elemente löschen und neu anlegen)
 *
 ***************************************************************************************************/
function updateListe(data) {
  $('#liste').empty()
  for (let i = 0; i < data.length; i++) {
      let completedClass = ''
      let checkboxChecked = ''

      if (data[i]['done'] == "true") {
          completedClass = "done text-muted"
          checkboxChecked = 'checked="checked"'
      }


      let item = `<li class="list-group-item ${completedClass}"  id="item_${data[i]['id']}">
          <input class="form-check-input me-1 rounded-0 tddCheckbox" ${checkboxChecked} type="checkbox" value="${data[i]['id']}" id="checkbox_${data[i]['id']}">
          ${data[i]['name']}
          <i class="bi bi-x-square force-pull-right" onClick="deleteTodoItem('${data[i]['id']}')"></i>
      </li>`;

      $("#liste").append(item);
  }
}

/****************************************************************************************************
 *
 * Elemente von der API holen und liste aktualisieren
 *
 ***************************************************************************************************/
function loadTodos() {

  $.ajax({
          url: API_URL + "/todos",
          crossDomain: true,
      })
      .done(function(data) {
          updateListe(data)
      });
}
App.pageCode = (options) => {
  let id = parseInt(options.id);
  let group = App.data.groups.row(row => row.id === id) || {};
  App.page.html = `
    <h1>Edit group ${group.id}</h1>
    <label>Session:</label>
    <input name="session" value="${group.session}" autofocus>
    <label>Type:</label>
    <input name="type" value="${group.type}" autofocus>
    <label>Stream:</label>
    <input name="stream" value="${group.stream}">
    <label>Chair:</label>
    <select name="chairId" value="${group.chairId}">
      ${App.peopleOptions(group.chairId)}
    </select>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.page.onCancel()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em;}
  `;
  App.page.onOk = () => {
    group.session = parseInt(App.page.elt.querySelector(`[name="session"]`).value);
    group.type = App.page.elt.querySelector(`[name="type"]`).value;
    group.stream = App.page.elt.querySelector(`[name="stream"]`).value;
    group.chairId = parseInt(App.page.elt.querySelector(`[name="chairId"]`).value);
    App.isDirty(true);
    App.goBack();
  };
  App.page.onCancel = () => {
    App.goBack();
  };
};

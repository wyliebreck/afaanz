App.pageCode = (options) => {
  let id = options.id;
  App.page.html = `
    <h1>Edit institution</h1>
    <input name="newName" value="${id}" autofocus>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.page.onCancel()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em;}
  `;
  App.page.onOk = () => {
    const newName = App.page.elt.querySelector(`[name="newName"]`).value.trim();
    if (newName !== id) {
      App.updateInstitution(id, newName);
      App.addChange("institution", id, newName);
      App.isDirty(true);
      App.goBack({}, newName);
    }
  };
  App.page.onCancel = () => {
    App.goBack({}, id);
  };
};

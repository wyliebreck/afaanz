App.pageCode = (options) => {
  let id = options.id;
  App.page.html = `
    <h1>Edit stream</h1>
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
      App.updateStream(id, newName);
      App.addChange("stream", id, newName);
      App.isDirty(true);
      App.goBack({}, newName);
    }
  };
  App.page.onCancel = () => {
    App.goBack({}, id);
  };
};
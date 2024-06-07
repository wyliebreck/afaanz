App.pageCode = (options) => {
  App.page.html = `
    <h1>Save changes</h1>
    <p>You are about to save your changes. If you'd like to be safe, you can take a snapshot of the existing data before saving your changes.</p>
    <p class="center"><a onclick="App.getPage('pgSnapshot.js', {setBackTo: true})">Take a snapshot</a></p>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.goBack()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em}
  `;
  App.page.onOk = async (page) => {
    await App.writeData();
    App.isDirty(false);
    if (App.goBack) App.goBack();
  };
};

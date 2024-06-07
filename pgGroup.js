App.pageCode = (options = {}) => {
  let id = App.pageValue("id", options.id);
  let group = new App.Group(id);
  App.page.html = `
    <h1>Group ${group.id()}</h1>
    <table class="info">
      <tr>
        <td>Session:</td>
        <td>${group.session()}</td>
      </tr>
      <tr>
        <td>Type:</td>
        <td>${group.type()}</td>
      </tr>
      <tr>
        <td>Stream:</td>
        <td>${group.stream()}</td>
      </tr>
      <tr>
        <td>Papers:</td>
        <td>${group.papers().map(paper => `Paper ${paper.id()}<br>${paper.stream()}<br>${paper.title()}`).join("<hr>")}</td>
      </tr>
      <tr>
        <td>Chair:</td>
        <td>${group.chair().id() ? group.chair().fullName() : ""}</td>
      </tr>
    </table>
    <div class="buttons">
      <button onclick="App.getPage('pgEditGroup.js', {id: ${group.id()}, setBackTo: true})">Edit</button>
      <button onclick="App.goBack({}, ${group.id()})">Close</button>
    </div>
  `;
  App.page.css = `
    #page {
      max-width: 50em;
    }
  `;
};

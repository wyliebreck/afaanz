App.pageCode = (options = {}) => {
  let paper = new App.Paper(options.id*1);
  App.page.html = `
    <h1>Paper ${paper.id()}</h1>
    <table class="info">
      <tr>
        <td>Stream:</td>
        <td>${paper.stream()}</td>
      </tr>
      <tr>
        <td>Title:</td>
        <td>${paper.title()}</td>
      </tr>
      <tr>
        <td>Authors:</td>
        <td>${paper.authors().map(person => `${person.fullName()} (${person.institution()})`).join("<hr>")}</td>
      </tr>
      <tr>
        <td>Discussant:</td>
        <td>${paper.data.discussantId ? `${paper.discussant().fullName()} (${paper.discussant().institution()})` : ""}</td>
      </tr>
    </table>
    <div class="buttons">
      <button onclick="App.getPage('pgEditPaper.js', {id: ${paper.id()}, setBackTo: true})">Edit</button>
      <button onclick="App.goBack({}, ${paper.id()})">Close</button>
    </div>
  `;
  App.page.css = `
    #page {
      max-width: 50em;
    }
  `;
};

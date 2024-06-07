App.pageCode = (options = {}) => {
  let id = App.pageValue("id", parseInt(options.id));
  let person = new App.Person(id);
  App.page.html = `
    <h1>Person ${person.id()}</h1>
    <table class="info">
      <tr>
        <td>Name:</td>
        <td>${person.fullName()}</td>
      </tr>
      <tr>
        <td>Institution:</td>
        <td>${person.institution()}</td>
      </tr>
      <tr>
        <td>Position:</td>
        <td>${person.position()}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>${person.email()}</td>
      </tr>
      <tr>
        <td>Attending:</td>
        <td>${person.attending() ? "Yes" : "No"}</td>
      </tr>
      <tr>
        <td>Papers:</td>
        <td>${person.papers().map(paper => `Session ${paper.group().session()}, Group ${paper.group().id()}, Paper ${paper.id()}<br>${paper.stream()}<br>${paper.title()}`).join("<hr>")}</td>
      </tr>
      <tr>
        <td>Chair streams:</td>
        <td>${person.chairStreams().join("<br>")}</td>
      </tr>
      <tr>
        <td>Chairing:</td>
        <td>${person.chairing().map(group => `Session ${group.session()}, Group ${group.id()}, Type ${group.type()}<br>${group.stream()}`).join("<hr>")}</td>
      </tr>
      <tr>
        <td>Discussant streams:</td>
        <td>${person.discussantStreams().join("<br>")}</td>
      </tr>
      <tr>
        <td>Discussing:</td>
        <td>${person.discussing().map(paper => `Session ${paper.group().session()}, Group ${paper.group().id()}, Paper ${paper.id()}<br>${paper.stream()}<br>${paper.title()}`).join("<hr>")}</td>
      </tr>
    </table>
    <div class="buttons">
      <button onclick="App.getPage('pgEditPerson.js', {id: ${person.id()}, setBackTo: true})">Edit</button>
      <button onclick="App.goBack({}, ${person.id()})">Close</button>
    </div>
  `;
  App.page.css = `
    #page {
      max-width: 40em;
    }
  `;
};

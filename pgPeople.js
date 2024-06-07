App.pageCode = (options = {}) => {
  let peopleRows = App.data.people.copy().sort("lastName", "firstName").rows();
  let html = `
    <h1>Browse the people</h1>
    <table class="headers">
      <tr>
        <td>Id</td>
        <td>Last name</td>
        <td>First name</td>
        <td>Institution</td>
        <td>Position</td>
        <td>Email</td>
        <td>Attending</td>
        <td>Chr.Streams</td>
        <td>Dsc.Streams</td>
      </tr>
  `;
  for (let row of peopleRows) {
    let person = new App.Person(row);
    html += `
      <tr id="${person.id()}" onclick="App.getPage('pgPerson.js', {id: this.id, setBackTo: true})">
        <td class="center">${person.id()}</td>
        <td class="left">${person.lastName()}</td>
        <td class="left">${person.firstName()}</td>
        <td class="left">${person.institution()}</td>
        <td class="left">${person.position()}</td>
        <td class="left">${person.email()}</td>
        <td class="center">${person.attending() ? "Yes" : "No"}</td>
        <td class="center">${person.chairStreams().join("<hr>")}</td>
        <td class="center">${person.discussantStreams().join("<hr>")}</td>
      </tr>
    `;
  }
  html += `</table>`;
  App.page.html = html;
};

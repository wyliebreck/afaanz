App.pageCode = (options = {}) => {
  let peopleRows = App.data.people.copy()
    .sort("~attending")
    .group("lastName", "firstName")
    .sort("lastName", "firstName")
    .select(row => row.id.length > 1)
    .rows();
  let html = `
    <h1>Tidy the people</h1>
    <table class="headers">
      <tr>
        <td>Last name</td>
        <td>First name</td>
        <td>id</td>
        <td>Institution</td>
        <td>Attending</td>
        <td>Position</td>
        <td>Email</td>
        <td>Action</td>
      </tr>
  `;
  for (let row of peopleRows) {
    let person = new App.Person(row);
    html += `<tbody>`;
    for (let i = 0; i <= 1; i++) {
      html += `
        <tr id="${person.id()[i]}" onclick="App.getPage('pgEditPerson.js', {id: this.id, setBackTo: true})">
          <td class="left">${person.lastName()}</td>
          <td class="left">${person.firstName()}</td>
          <td class="center">${person.id()[i]}</td>
          <td class="left">${person.institution()[i]}</td>
          <td class="center">${person.attending()[i]}</td>
          <td class="left">${person.position()[i]}</td>
          <td class="left">${person.email()[i]}</td>
          <td class="center"><a onclick="App.page.remove(${person.id()[i]}, ${person.id()[(i+1)%2]})">Remove</a></td>
        </tr>
      `;
    }
    html += `</tbody>`;
  }
  html += `</table>`;
  App.page.html = html;
  App.page.css = `
    main tbody:not(:first-child) {border: medium black solid}
    main table button {padding: 4px}
  `;
  App.page.remove = (oldId, newId) => {
    //alert(`From ${oldId} to ${newId}`);
    // Update papers
    for (let row of App.data.papers.rows()) {
      row.discussantId = row.discussantId === oldId ? newId : row.discussantId;
      row.authorIds = row.authorIds.map(id => id === oldId ? newId : id).uniques().sort();
    }
    // Update groups
    for (let row of App.data.groups.rows()) {
      row.chairId = row.chairId === oldId ? newId : row.chairId;
    }
    // Remove the person
    App.data.people.select(row => row.id !== oldId);
    // Mark as dirty
    App.isDirty(true);
    // Refresh the page
    App.getPage("pgDoubles.js");
  }
};

App.pageCode = (options = {}) => {
  let counts = App.data.people.column("institution").counts();
  let html = `
    <h1>Tidy the institutions</h1>
    <table class="headers">
      <tr>
        <td>Count</td>
        <td>Name</td>
      </tr>
  `;
  for (const institution of [...counts.keys()].extants().sort()) {
    html += `
      <tr id="${institution}" onclick="App.getPage('pgEditInstitution.js', {id: this.id, setBackTo: true})">
        <td class="center">${counts.get(institution)}</td>
        <td class="left">${institution}</td>
      </tr>
    `;
  }
  html += `</table>`;
  App.page.html = html;
};

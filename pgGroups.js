App.pageCode = (options = {}) => {
  let html = `<h1>Browse the groups</h1>`;
  html += `  
    <table class="headers">
      <tr>
        <td>Id</td>
        <td>Session</td>
        <td>Type</td>
        <td>Stream</td>
        <td>Papers</td>
      </tr>
    `;
  let groups = App.data.groups.rows().map(row => new App.Group(row));
  for (let group of groups) {
    html += `
      <tr id="${group.id()}" onclick="App.getPage('pgGroup.js', {id: ${group.id()}, setBackTo: true})">
        <td class="center">${group.id()}</td>
        <td class="left">${group.session()}</td>
        <td class="left">${group.type()}</td>
        <td class="left">${group.stream()}</td>
        <td class="left">${group.papers().map(paper => paper.idTitle()).join("<hr>")}</td>
      </tr>
    `;
  }
  html += `</table>`;
  App.page.html = html;
  App.page.css = `
    main hr {border: thin lightgray solid}
  `;
};

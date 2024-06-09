App.pageCode = (options = {}) => {
  let html = `
    <h1>Browse the papers</h1>
    <table class="headers">
      <tr>
        <td>Id</td>
        <td>Title</td>
        <td>Stream</td>
        <td>Authors</td>
      </tr>
  `;
  let papers = App.data.papers.rows().map(row => new App.Paper(row));
  for (let paper of papers) {
    html += `
      <tr id="${paper.id()}" onclick="App.getPage('pgPaper.js', {id: this.id, setBackTo: true})">
        <td class="center">${paper.id()}</td>
        <td class="left">${paper.title()}</td>
        <td class="left">${paper.stream()}</td>
        <td class="left">${paper.authors().map(person => `${person.fullName()}<br>(${person.institution()})`).join("<hr>")}</td>
      </tr>
    `;
  }
  html += `</table>`;
  App.page.html = html;
  App.page.css = `
    main hr {border: thin lightgray solid}
  `;
};

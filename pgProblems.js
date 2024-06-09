App.pageCode = (options = {}) => {
  let html = `
    <h1>Check for problems</h1>
      <table class="headers">
        <tr class="head">
          <td>Role</td>
          <td>For</td>
          <td>Person</td>
          <td>Problems</td>
          <td></td>
        </tr>
  `;
  // Chairs
  let groups = App.data.groups.copy()
    .select(row => row.session > 0)
    .select(row => row.type !== "P")
    .sort("id")
    .rows()
    .map(row => new App.Group(row.id));
  for (let group of groups) {
    let problems = group.chairProblems();
    if (problems.length > 0) {
      html += `<tr class="chair" id="g${group.id()}">`
      html += `<td>Chair</td>`;
      html += `<td id="${group.id()}"><a onclick="App.getPage('pgGroup.js', {id: ${group.id()}, setBackTo: true})">Group ${group.id()}</a></td>`;
      if (group.chair().id()) html += `<td id="${group.chair().id()}"><a onclick="App.getPage('pgPerson.js', {id: ${group.chair().id()}, setBackTo: true})">${group.chair().fullName()}</a></td>`;
      else html += `<td></td>`;
      html += `<td>${problems.join("<hr>")}</td>`;
      html += `<td><button onclick="App.getPage('pgAssign.js', {type: 'chair', id: ${group.id()}, setBackTo: true})">Find...</button></td>`;
      html += `</tr>`;
    }
  }
  // Discussants
  let papers = App.data.groups.rows()
    .filter(row => row.session > 0)
    .filter(row => row.type === "D")
    .flatMap(row => row.paperIds)
    .uniques()
    .sort((a, b) => a - b)
    .map(id => new App.Paper(id));
  for (let paper of papers) {
    let problems = paper.discussantProblems();
    if (problems.length > 0) {
      html += `<tr class="discussant" id="p${paper.id()}">`;
      html += `<td>Discussant</td>`;
      html += `<td id="${paper.id()}"><a onclick="App.getPage('pgPaper.js', {id: ${paper.id()}, setBackTo: true})">Paper ${paper.id()}</a></td>`;
      if (paper.discussant().id()) html += `<td id="${paper.discussant().id()}"><a onclick="App.getPage('pgPerson.js', {id: ${paper.discussant().id()}, setBackTo: true})">${paper.discussant().fullName()}</a></td>`;
      else html += `<td></td>`;
      html += `<td>${problems.join("<hr>")}</td>`;
      html += `<td><button onclick="App.getPage('pgAssign.js', {type: 'discussant', id: ${paper.id()}, setBackTo: true})">Find...</button></td>`;
      html += `</tr>`;  
    }
  }
  html += `</table>`;
  App.page.html = html;
  App.page.css = `
    main button {
      padding: 2px 4px;
      min-width: auto;
    }
    main hr {
      border: thin lightgray solid;
    }
  `;
};

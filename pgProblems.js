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
    let problems = [];
    let chair = group.chair();
    let session = new App.Session(group.session());
    if (!chair.id()) problems.push("Missing");
    else {
      if (!(chair.attending())) problems.push("Not attending");
      if (!(chair.chairStreams().includes(group.stream()))) problems.push("Hasn't nominated the group's stream");
      if (chair.chairing().length >= 2) problems.push(`Chairing ${chair.chairing().length} groups`);
      if (session.authorIds().includes(chair.id())) problems.push(`Authoring a paper in the session`);
    }
    if (problems.length > 0) {
      html += `<tr class="chair" id="g${group.id()}">`
      html += `<td>Chair</td>`;
      html += `<td><a onclick="App.getPage('pgGroup.js', {id: ${group.id()}, setBackTo: true})">Group ${group.id()}</a></td>`;
      if (group.chair().id()) html += `<td><a onclick="App.getPage('pgPerson.js', {id: ${group.chair().id()}, setBackTo: true})">${group.chair().fullName()}</a></td>`;
      else html += `<td></td>`;
      html += `<td>${problems.join("<br>")}</td>`;
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
    let problems = [];
    let discussant = paper.discussant();
    let session = new App.Session(paper.group().session());
    if (!discussant.id()) problems.push("Missing");
    else {
      if (!(discussant.attending())) problems.push("Not attending");
      if (!(discussant.discussantStreams().includes(paper.stream()))) problems.push("Hasn't nominated the paper's stream");
      if (discussant.discussing().length >= 2) problems.push(`Discussing ${discussant.discussing().length} papers`);
      if (session.authorIds().includes(discussant.id())) problems.push(`Authoring a paper in the session`);
      if (paper.institutions().includes(discussant.institution())) problems.push("Bad institution");
    }
    if (problems.length > 0) {
      html += `<tr class="discussant" id="p${paper.id()}">`;
      html += `<td>Discussant</td>`;
      html += `<td><a onclick="App.getPage('pgPaper.js', {id: ${paper.id()}, setBackTo: true})">Paper ${paper.id()}</a></td>`;
      if (paper.discussant().id()) html += `<td><a onclick="App.getPage('pgPerson.js', {id: ${paper.discussant().id()}, setBackTo: true})">${paper.discussant().fullName()}</a></td>`;
      else html += `<td></td>`;
      html += `<td>${problems.join("<br>")}</td>`;
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
  `;
};

App.pageCode = (options = {}) => {
  let showAuthors = App.pageValue("showAuthors", options.showAuthors);
  let html = `<h1>View the current assignment</h1>`;
  // Show authors
  html += `<p class="center"><label><input type="checkbox" onclick="App.page.toggleAuthors()" ${showAuthors ? "checked" : ""}> Show authors</label></p>`;
  // Filters
  let sessions = App.data.groups.column("session")
    .map(x => parseInt(x))
    .filter(x => x > 0)
    .uniques();
  html += `<p class="center filters">`;
  html += `<a onclick="App.getPage('pgView.js')">All</a>`;
  for (let session of sessions) {
    html += `<a onclick="App.getPage('pgView.js', {session: ${session}})">Sess${session}</a>`;
  }
  html += `</p>`;
  // Get the groups
  let groups = App.data.groups.copy()
    .select(row => row.session > 0);
  if (options.session > 0) groups.select(row => row.session === options.session);
  groups = groups.sort("session", "id")
    .rows()
    .map(row => new App.Group(row.id));
  // Show the groups
  html += `<table class="headers">`;
  html += `<tr class="head">`;
  html += `<td>Sess</td>`;
  html += `<td>Grp</td>`;
  html += `<td>Role</td>`;
  html += `<td>Paper</td>`;
  html += `<td>Person Id</td>`;
  html += `<td>Person Name</td>`;
  html += `<td>Institution</td>`;
  //html += `<td>Email</td>`;
  html += `<td></td>`;
  html += `</tr>`;
  for (let group of groups) {
    html += `<tbody class="group">`;
    // Chair
    if (group.type() !== "P") {
      html += `<tr class="chair" id="g${group.id()}">`
      html += `<td>${group.session()}</td>`;
      html += `<td>${group.id()}</td>`;
      html += `<td>Chair</td>`;
      html += `<td></td>`;
      if (group.chair().id()) {
        html += `<td>${group.chair().id()}</td>`;
        html += `<td>${group.chair().fullName()}</td>`;
        html += `<td>${group.chair().institution()}</td>`;
        //html += `<td>${group.chair().email()}</td>`;
      }
      else {
        html += `<td class="missing"></td>`;
        html += `<td></td>`;
        html += `<td></td>`;
        //html += `<td></td>`;
      }
      html += `<td><button onclick="App.getPage('pgAssign.js', {type: 'chair', id: ${group.id()}, setBackTo: true})">Find...</button></td>`;
      html += `</tr>`;
    }
    // Papers
    for (let paper of group.papers()) {
      // Authors
      if (showAuthors) for (let author of paper.authors()) {
        html += `<tr class="author">`;
        html += `<td>${group.session()}</td>`;
        html += `<td>${group.id()}</td>`;
        html += `<td>Author</td>`;
        html += `<td>${paper.id()}</td>`;
        html += `<td>${author.id()}</td>`;
        html += `<td>${author.fullName()}</td>`;
        html += `<td>${author.institution()}</td>`;
        //html += `<td>${author.email()}</td>`;
        html += `<td></td>`;
        html += `</tr>`;
      }
      // Discussant
      if (group.type() === "D") {
        html += `<tr class="discussant" id="p${paper.id()}">`;
        html += `<td>${group.session()}</td>`;
        html += `<td>${group.id()}</td>`;
        html += `<td>Discussant</td>`;
        html += `<td>${paper.id()}</td>`;
        if (paper.discussant().id()) {
          html += `<td id="${paper.id()}">${paper.discussant().id()}</td>`;
          html += `<td>${paper.discussant().fullName()}</td>`;
          html += `<td>${paper.discussant().institution()}</td>`;
          //html += `<td>${paper.discussant().email()}</td>`;
        }
        else {
          html += `<td id="${paper.id()}" class="missing"></td>`;
          html += `<td></td>`;
          html += `<td></td>`;
          //html += `<td></td>`;
        }
        html += `<td><button onclick="App.getPage('pgAssign.js', {type: 'discussant', id: ${paper.id()}, setBackTo: true})">Find...</button></td>`;
        html += `</tr>`;
      }
    }
    html += `</tbody>`;
  }
  html += `</table>`;
  App.page.html = html;
  App.page.css = `
    main button {
      padding: 2px 4px;
      min-width: auto;
    }
    main tbody.group {
      border-top: medium black solid;
    }
    input[type="checkbox"] {
      display: inline;
    }
    p.filters a {
      display: inline-block;
      margin: 0 0.25em;
    }
    table.headers tr:first-child {
      background-color: white;
    }
    td.missing {
      background-color: orange !important;
    }
    tr.head td {
      background-color: var(--light-gray);
    }
  `;
  App.page.toggleAuthors = () => {
    App.getPage("pgView.js", {showAuthors: !showAuthors});
  };
};

App.pageCode = (options = {}) => {
  let counts = {};
  counts.institution = App.data.people.column("institution").counts();
  let streams1 = App.data.papers.column("stream");
  let streams2 = App.data.people.column("discussantStreams");
  let streams3 = App.data.people.column("chairStreams");
  let streams4 = App.data.groups.column("stream");
  let streams = streams1.concat(streams2).concat(streams3).concat(streams4).extants();
  counts.stream = streams.counts();
  let html = `<h1>Apply previous tidyings</h1>`;
  html += `<p class="center"><button onclick="App.page.applyAll()">Apply all</button></p>`;
  html += `<table>`;
  for (let type of ["stream", "institution"]) {
    html += `
      <tr class="title"><td colspan="100"><h2>Changes to ${type}s</h2><td></tr>
    `;
    for (let row of App.data.changes.rows().filter(row => row.change === type)) {
      let count = counts[row.change].get(row.from) || 0;
      html += `
        <tr>
          <td class="left">${row.from}</td>
          <td>&rarr;</td>
          <td class="left">${row.to}</td>
          <td class="center">${count}</td>
          <td><button onclick='App.page.apply("${type}", "${row.from}", "${row.to}")' ${count === 0 ? "disabled" : ""}>Apply</button></td>
        </tr>
      `;
    }
  }
  html += `</table>`;
  App.page.html = html;
  App.page.apply = (change, from, to) => {
    if (change === "stream") App.updateStream(from, to);
    if (change === "institution") App.updateInstitution(from, to);
    App.isDirty(true);
    App.getPage("pgChanges.js");
  };
  App.page.applyAll = () => {
    App.updateAll();
    App.isDirty(true);
    App.getPage("pgChanges.js");
  };
  App.page.css = `
    main button:disabled {cursor: default; opacity: 0.25}
    main h2 {margin: 0.5em 0}
    main table td {vertical-align: middle}
    main table button {padding: 2px}
    main tr.title td {border: none}
  `;
};

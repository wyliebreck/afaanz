App.pageCode = () => {
  App.page.html = `
    <h1>Search</h1>
    <input id="searchText" onkeydown="App.page.onKey(event)">
    <div id="results"></div>
    <div class="buttons">
      <button onclick="App.goBack()">Done</button>
    </div>
  `;
  App.page.css = `
    main table {
      width: 100%;
    }
    main table td:nth-child(1) {
      text-align: center;
      width: 4em;
    }
    main table td:nth-child(2) {
      text-align: center;
      width: 3em;
    }
    #page {
      max-width: 50em;
    }
  `;
  App.page.onLoad = () => {
    App.page.elt.querySelector("#searchText").value = App.pageValue("searchText") || "";
    App.page.search();
  };
  App.page.onKey = (evt) => {
    if (evt.key === "Enter") App.page.search();
  };
  App.page.search = () => {
    let input = App.page.elt.querySelector("#searchText");
    let results = App.page.elt.querySelector("#results");
    input.select();
    const searchText = input.value.trim();
    let html = "";
    if (searchText) {
      App.pageValue("searchText", searchText);
      let rows = "";
      // People
      App.data.people.rows()
        .filter((row) =>
          (row.id + "").includes(searchText) ||
          row.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          row.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          row.institution.toLowerCase().includes(searchText.toLowerCase())
        )
        .forEach((row) => {
          rows += `
            <tr onclick="App.getPage('pgPerson.js', {id: ${row.id}, setBackTo: true})">
              <td>Person</td>
              <td>${App.showMatches(searchText, row.id+"")}</td>
              <td>${App.showMatches(searchText, row.firstName+" "+row.lastName+"<br>"+row.institution)}</td>
            </tr>
          `;
        });
      // Papers
      App.data.papers.rows()
        .filter((row) =>
          (row.id + "").includes(searchText) ||
          row.title.toLowerCase().includes(searchText.toLowerCase()) ||
          row.stream.toLowerCase().includes(searchText.toLowerCase())
        )
        .forEach((row) => {
          rows += `
            <tr onclick="App.getPage('pgPaper.js', {id: ${row.id}, setBackTo: true})">
              <td>Paper</td>
              <td>${App.showMatches(searchText, row.id+"")}</td>
              <td>${App.showMatches(searchText, row.title+"<br>"+row.stream)}</td>
            </tr>
          `;
        });
      if (rows > "") {
        html = `
          <table class="headers">
            <tr onclick="App.sortTable(event)"><td>Type</td><td>Id</td><td>Details</td></tr>
            ${rows}
          </table>
        `;
      }
      else html = `<p class="center">No matches found</p>`;
    }
    results.innerHTML = html;
  };
};

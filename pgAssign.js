App.pageCode = (options = {}) => {
  let type = App.pageValue("type", options.type);
  let id = App.pageValue("id", options.id);
  let object;
  let people;
  let returnId;
  if (type === "discussant") {
    object  = new App.Paper(id);
    people = {
      strict: object.possibleDiscussants("strict"),
      relaxed: object.possibleDiscussants("relaxed"),
    };
    returnId = `p${id}`;
  }
  if (type === "chair") {
    object  = new App.Group(id);
    people = {
      strict: object.possibleChairs("strict"),
      relaxed: object.possibleChairs("relaxed"),
    };
    returnId = `g${id}`;
  }
  let strictIds = people.strict.map(person => person.id());
  people.relaxed = people.relaxed.filter(person => !strictIds.includes(person.id())); 
  let html = `
    <h1>Find a ${type}</h1>
    <table class="info">
  `;
  if (type === "chair") {
    html += `<tr><td>Group id:</td><td>${object.id()}</td></tr>`;
    html += `<tr><td>Session:</td><td>${object.session()}</td></tr>`;
    html += `<tr><td>Stream:</td><td>${object.stream()}</td></tr>`;
    html += `<tr><td>Type:</td><td>${object.type()}</td></tr>`;
    html += `<tr><td>Papers:</td><td>${object.papers().map(paper => paper.idTitle()).join("<hr>")}</td></tr>`;
  }
  if (type === "discussant") {
    html += `<tr><td>Paper id:</td><td>${object.id()}</td></tr>`;
    html += `<tr><td>Title:</td><td>${object.title()}</td></tr>`;
    html += `<tr><td>Stream:</td><td>${object.stream()}</td></tr>`;
    html += `<tr><td>Authors:</td><td>${object.authors().map(person => `${person.fullName()} (${person.institution()})`).join("<hr>")}</td></tr>`;
  }
  html += `</table>`;
  html += `<table class="headers">
      <tr>
        <td>Match</td>
        <td>Name</td>
        <td>Affiliation</td>
        <td>Nominated streams</td>
        <td></td>
      </tr>
  `;
  for (let match of ["Strict", "Relaxed"]) {
    for (let person of people[match.toLowerCase()]) {
      html += `
        <tr id="${person.id()}">
          <td class="center"><div class="${match}">${match}</div></td>
          <td class="left"><a onclick="App.getPage('pgPerson.js', {id: ${person.id()}, setBackTo: true})">${person.reverseName()}</a></td>
          <td class="left">${person.institution()}<br>${person.position()}</td>
          <td class="left">${(type === "discussant" ? person.discussantStreams() : person.chairStreams()).join("<br>")}</td>
          <td><button onclick="App.page.assign(${person.id()})">Assign</button></td>
        </tr>
      `;
    }
  }
  html += `</table>`;
  html += `
    <div class="buttons">
      <button onclick="App.goBack({}, '${returnId}')">Cancel</button>
    </div>
  `;
  App.page.html = html;
  App.page.css = `
    main td button {
      padding: 2px 4px;
      min-width: auto;
    }
    div.Strict {
      background-color: green;
      color: white;
      padding: 4px;
    }
    div.Relaxed {
      background-color: orange;
      color: white;
      padding: 4px;
    }
    table.info {
      margin: 1em auto;
      max-width: 40em;
      width: auto;
    }
  `;
  App.page.assign = async (personId) => {
    if (type === "discussant") object.data.discussantId = personId;
    if (type === "chair") object.data.chairId = personId;
    App.isDirty(true);
    App.goBack({}, returnId);
  };
};

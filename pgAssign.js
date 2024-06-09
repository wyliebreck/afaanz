App.pageCode = (options = {}) => {
  let type = App.pageValue("type", options.type);
  let id = App.pageValue("id", options.id);
  let object;
  let matches;
  let returnId;
  if (type === "discussant") {
    object  = new App.Paper(id);
    matches = object.possibleDiscussants(),
    returnId = `p${id}`;
  }
  if (type === "chair") {
    object  = new App.Group(id);
    matches = object.possibleChairs();
    returnId = `g${id}`;
  }
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
  matches = matches.filter(match => match.level < 99);
  matches.sort((a, b) => a.level - b.level);
  for (let match of matches) {
    let person = new App.Person(match.id);
    html += `
      <tr id="${person.id()}">
        <td class="center"><div class="level l${match.level}">${match.level}</div></td>
        <td class="left"><a onclick="App.getPage('pgPerson.js', {id: ${person.id()}, setBackTo: true})">${person.reverseName()}</a></td>
        <td class="left">${person.institution()}<br>${person.position()}</td>
        <td class="left">${(type === "discussant" ? person.discussantStreams() : person.chairStreams()).join("<br>")}</td>
        <td><button onclick="App.page.assign(${person.id()})">Assign</button></td>
      </tr>
    `;
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
    div.level {
      color: white;
      padding: 4px;
    }
    div.l1 {background-color: #ffd700;}
    div.l2 {background-color: #c0c0c0;}
    div.l3 {background-color: #cd7f32;}
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

App.pageCode = (options) => {
  let streamPapers = App.data.groups.rows()
    .filter(row => row.session > 0)
    .flatMap(row => row.paperIds)
    .map(id => new App.Paper(id))
    .map(paper => paper.stream())
    .extants()
    .counts();
  let streamPapersD = App.data.groups.rows()
    .filter(row => row.session > 0)
    .filter(row => row.type === "D")
    .flatMap(row => row.paperIds)
    .map(id => new App.Paper(id))
    .map(paper => paper.stream())
    .extants()
    .counts();
  let streamPapersN = App.data.groups.rows()
    .filter(row => row.session > 0)
    .filter(row => row.type === "N")
    .flatMap(row => row.paperIds)
    .map(id => new App.Paper(id))
    .map(paper => paper.stream())
    .extants()
    .counts();
  let streamDiscussants = App.data.people
    .column("discussantStreams")
    .flat()
    .extants()
    .counts();
  let streamGroups = App.data.groups.rows()
    .filter(row => row.session > 0)
    .map(row => row.stream)
    .extants()
    .counts();
  let streamChairs = App.data.people
    .column("chairStreams")
    .flat()
    .extants()
    .counts();
  let streams = [...streamPapers.keys(), ...streamDiscussants.keys(), ...streamGroups.keys(), ...streamChairs.keys()]
    .uniques()
    .sort();
  let html = `
    <h1>Tidy the streams</h1>
    <table class="headers">
      <tr>
        <td>Stream</td>
        <td>Papers</td>
        <td>PapersN</td>
        <td>PapersD</td>
        <td>Discussants</td>
        <td>Groups</td>
        <td>Chairs</td>
      </tr>
  `;
  for (let stream of streams) {
    let numPapers = streamPapers.get(stream) || 0;
    let numPapersD = streamPapersD.get(stream) || 0;
    let numPapersN = streamPapersN.get(stream) || 0;
    let numDiscussants = streamDiscussants.get(stream) || 0;
    let discussantsColor = numDiscussants < numPapersD ? "orange" : "";
    let numGroups = streamGroups.get(stream) || 0;
    let numChairs = streamChairs.get(stream) || 0;
    let chairsColor = numChairs < numGroups && stream !== "Panel" ? "orange" : "";
    html += `
      <tr id="${stream}" onclick="App.getPage('pgEditStream.js', {id: this.id, setBackTo: true})">
        <td>${stream}</td>
        <td class="center">${numPapers}</td>
        <td class="center">${numPapersN}</td>
        <td class="center" style="background-color:${discussantsColor}">${numPapersD}</td>
        <td class="center" style="background-color:${discussantsColor}">${numDiscussants}</td>
        <td class="center" style="background-color:${chairsColor}">${numGroups}</td>
        <td class="center" style="background-color:${chairsColor}">${numChairs}</td>
      </tr>
    `;
  }
  html += "</table>";
  App.page.html = html;
};

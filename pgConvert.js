App.pageCode = () => {
  // HTML
  App.page.html = `
    <h1>Convert the raw data</h1>
    <p>You are about to convert the raw data. This will replace all of your existing data, and it cannot be undone.</p>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.goBack()">Cancel</button>
    </div>
  `;
  // CSS
  App.page.css = `
    #page {max-width: 35em}
  `;
  // Functions
  App.page.onOk = async () => {

    // Prepare
    App.showStatus("Converting the raw data...");
    const rawHandle = await App.handle.getDirectoryHandle("raw");
    const dataHandle = await App.handle.getDirectoryHandle("data");
    let fileHandle, file, text, writable;
    let papers = [];
    let people = [];
    let groups = [];

    // Convert submissions.csv
    // Get the raw data
    fileHandle = await rawHandle.getFileHandle("submissions.csv");
    file = await fileHandle.getFile();
    text = await file.text();
    let submissions = new Table(Papa.parse(text, {header: true}).data);
    // Convert it
    const maxAuthors = submissions.names()
      .filter(name => name.startsWith("AUTHOR"))
      .map(name => parseInt(name.split(" ")[1]))
      .max();
    for (const row of submissions.rows()) {
      let status = (row["ACCEPTANCE"] || "").trim();
      if (status !== "Reject") {
        let paper = {};
        paper.id = parseInt(row["SUBMISSION ID"]);
        paper.title = (row["TITLE"] || "A paper about something").trim();
        paper.stream = (row["TOPIC(S)"] || "").trim();
        paper.authorIds = [];
        for (let n = 1; n <= maxAuthors; n++) {
          const prefix = `AUTHOR ${n}`;
          if (row[`${prefix} ORGANIZATION`] > "") {
            let email = (row[`${prefix} EMAIL`] || "").trim().toLowerCase();
            let person;
            if (email > "") person = people.find(x => x.email === email);
            if (!person) {
              person = {};
              person.id = people.length + 1;
              person.lastName = (row[`${prefix} LAST NAME`] || "").trim();
              person.firstName = (row[`${prefix} FIRST NAME`] || "").trim();
              person.institution = (row[`${prefix} ORGANIZATION`] || "").trim();
              person.position = "";
              person.email = email;
              person.attending = 0;
              person.chairStreams = [];
              person.discussantStreams = [];
              people.push(person);
            }
            paper.authorIds.push(person.id);
            //if (row["CONTACT AUTHOR"] === `Author ${n}`) paper.contactId = person.id;
          }
        }
        paper.authorIds = paper.authorIds.uniques().sort((a, b) => a - b);
        paper.discussantId = 0;
        papers.push(paper);
      }
    }

    // Convert registrations.csv
    // Get the raw data
    fileHandle = await rawHandle.getFileHandle("registrations.csv");
    file = await fileHandle.getFile();
    text = await file.text();
    let registrations = new Table(Papa.parse(text, {header: true}).data);
    // Convert it
    const maxChairStreams = registrations.names()
      .filter(name => name.startsWith("Marketing - Chair"))
      .map(name => parseInt(name.split(" - ")[2]))
      .max();
    const maxDiscussantStreams = registrations.names()
      .filter(name => name.startsWith("Marketing - Discussant"))
      .map(name => parseInt(name.split(" - ")[2]))
      .max();
    for (const row of registrations.rows()) {
      let email = (row[`Email`] || "").trim().toLowerCase();
      let person;
      if (email > "") person = people.find(x => x.email === email);
      if (!person) {
        person = {};
        person.id = people.length + 1;
        person.lastName = (row[`Last Name`] || "").trim();
        person.firstName = (row[`First Name`] || "").trim();
        person.institution = (row[`Organization`] || "").trim();
        person.email = email;
        people.push(person);
      }
      person.position = (row[`Position`] || "").trim();
      person.attending = 1;
      person.chairStreams = [];
      for (let n = 1; n <= maxChairStreams; n++) {
        const colName = `Marketing - Chair - ${n}`;
        if (row[colName] > "") person.chairStreams.push(row[colName].trim());
      }
      person.chairStreams = person.chairStreams.uniques().sort();
      person.discussantStreams = [];
      for (let n = 1; n <= maxDiscussantStreams; n++) {
        const colName = `Marketing - Discussant - ${n}`;
        if (row[colName] > "") person.discussantStreams.push(row[colName].trim());
      }
      person.discussantStreams = person.discussantStreams.uniques().sort();
    }

    // Convert groupings.csv
    // Get the raw data
    fileHandle = await rawHandle.getFileHandle("groupings.csv");
    file = await fileHandle.getFile();
    text = await file.text();
    let groupings = new Table(Papa.parse(text, {header: true}).data);
    // Convert it
    for (const row of groupings.rows()) {
      let paperId = parseInt(row.paperId);
      let paper = papers.find(x => x.id === paperId);
      if (!paper) {
        console.log(`Missing paper ${paperId}`);
        continue;
      }
      let groupId = parseInt(row.groupId);
      let group = groups.find(x => x.id === groupId);
      if (!group) {
        group = {
          id: groupId,
          type: row.groupType.trim(),
          stream: row.groupStream.trim(),
          session: parseInt(row.sessionNum),
          chairId: 0,
          paperIds: [],
        };
        groups.push(group);
      }
      group.paperIds.push(paperId);
      group.paperIds = group.paperIds.sort((a, b) => a - b);
    }
    groups.sort((a, b) => a.id - b.id);

    // Convert panelists.csv
    // Get the raw data
    fileHandle = await rawHandle.getFileHandle("panelists.csv");
    file = await fileHandle.getFile();
    text = await file.text();
    let panelists = new Table(Papa.parse(text, {header: true}).data);
    // Convert it
    panelists.insert({personId: row => people.find(person => person.email === row.email.trim()).id});
    let panelSessions = panelists.column("session").uniques().sort();
    for (let session of panelSessions) {
      let personIds = panelists.rows().filter(row => row.session === session).map(row => row.personId);
      let paperId = Math.max(...papers.filter(x => x.id > 0).map(x => x.id)) + 1;
      let paper = {
        id: paperId,
        title: "Panel",
        stream: "Panel",
        authorIds: personIds,
        discussantId: 0,
      }
      papers.push(paper);
      let groupId = Math.max(...groups.map(x => x.id)) + 1;
      let group = {
        id: groupId,
        type: "P",
        stream: "Panel",
        session: parseInt(session),
        chairId: 0,
        paperIds: [paperId],
      }
      groups.push(group);
    }

    // Save the data
    // Papers
    fileHandle = await dataHandle.getFileHandle(`papers.json`, {create: true});
    writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(papers));
    await writable.close();
    // People
    fileHandle = await dataHandle.getFileHandle(`people.json`, {create: true});
    writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(people));
    await writable.close();
    // Groups
    fileHandle = await dataHandle.getFileHandle(`groups.json`, {create: true});
    writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(groups));
    await writable.close();

    // Done
    App.showStatus("Done");
    await App.readData();
    App.getPage("pgChanges.js");
  
  };
};

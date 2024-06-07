App.pageCode = (options = {}) => {
  App.page.html = `
    <h1>Generate assignments</h1>
    <p>You are about to generate some possible assignments of groups, discussants, and chairs. This will replace any existing assignment.</p>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.goBack()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em}
  `;
  var clashes = [];
  App.page.onOk = () => {
    App.assignments = [];
    console.clear();
    for (let n = 1; n <= 100; n++) {
      App.page.generateAssignment();
    }
    console.log(clashes.counts());
    App.getPage("pgChoose.js");
  };

  // Generate an assignment
  App.page.generateAssignment = () => {
    // Clear the existing assignments
    App.data.groups.update({
      chairId: row => 0,
    });
    App.data.papers.update({
      discussantId: row => 0,
    });
    // Initialise the values
    let assignment = {discussants: [], chairs: []};
    // Assign discussants
    let groups = App.data.groups.rows()
      .filter(row => row.session > 0)
      .filter(row => row.type === "D")
      .shuffle()
      .map(row => new App.Group(row));
    for (let group of groups) {
      let papers = group.papers();
      for (let paper of papers) {
        
        // Temp line
        let sessionPersonIds = (new App.Session(group.data.session)).personIds();
        
        let possibleDiscussants = paper.possibleDiscussants();
        if (possibleDiscussants.length > 0) {
          let discussant = possibleDiscussants.shuffle()[0];
          paper.data.discussantId = discussant.data.id;
          assignment.discussants.push({paperId: paper.id(), discussantId: discussant.id()});
          
          // Temp line
          if (sessionPersonIds.includes(discussant.id())) {
            //console.log("Clash");
            //console.log(sessionPeopleIds);
            //console.log(discussant.id());
            clashes.push(discussant.id());
          }
        }
      }
    }
    // Assign chairs
    groups = App.data.groups.rows()
      .filter(row => row.session > 0)
      .shuffle()
      .map(row => new App.Group(row));
    for (let group of groups) {
      let possibleChairs = group.possibleChairs();
      if (possibleChairs.length > 0) {
        let chair = possibleChairs.shuffle()[0];
        group.data.chairId = chair.data.id;
        assignment.chairs.push({groupId: group.id(), chairId: chair.id()});
      }
    }
    // Add assignment to assignments
    App.assignments.push(assignment);
  };
};

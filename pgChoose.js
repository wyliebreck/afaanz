App.pageCode = (options = {}) => {
  let html = `
    <h1>Choose an assignment</h1>
  `;
  if (App.assignments.length === 0) {
    html += `
      <p class="center">No assignments have been generated</p>
    `;
  }
  else {
    html += `
      <table class="headers">
        <tr>
          <td>Discussants assigned</td>
          <td>Fraction</td>
          <td>Chairs assigned</td>
          <td>Fraction</td>
          <td></td>
        </tr>
    `;
    const discussantsNeeded = App.data.groups.rows()
      .filter(row => row.session > 0)
      .filter(row => row.type === "D")
      .flatMap(row => row.paperIds)
      .length;
    const chairsNeeded = App.data.groups.rows()
      .filter(row => row.session > 0)
      .filter(row => row.type !== "P")
      .length;
    App.assignments.forEach((assignment, idx) => {
      const discussantsAssigned = assignment.discussants.length;
      const chairsAssigned = assignment.chairs.length;
      html += `
        <tr>
          <td class="center">${discussantsAssigned}/${discussantsNeeded}</td>
          <td class="center">${Math.round(discussantsAssigned/discussantsNeeded*100)}%</td>
          <td class="center">${chairsAssigned}/${chairsNeeded}</td>
          <td class="center">${Math.round(chairsAssigned/chairsNeeded*100)}%</td>
          <td><button onclick="App.page.use(${idx})">Use</button></td>
        </tr>
      `;
    });
    html += `</table>`;
  }
  App.page.html = html;
  App.page.css = `
    main table td {vertical-align: middle}
    main table button {padding: 2px}
  `;
  App.page.use = (idx) => {
    // Clear the data
    App.data.groups.update({chairId: row => 0});
    App.data.papers.update({discussantId: row => 0});
    // Get the assigment
    const assignment = App.assignments[idx];
    // Apply the discussants
    for (let row of assignment.discussants) {
      let paper = new App.Paper(row.paperId);
      paper.data.discussantId = row.discussantId;
    }
    // Apply the chairs
    for (let row of assignment.chairs) {
      let group = new App.Group(row.groupId);
      group.data.chairId = row.chairId;
    }
    // Mark as dirty
    App.isDirty(true);
    // View the assignment
    App.getPage("pgView.js");
  };
};

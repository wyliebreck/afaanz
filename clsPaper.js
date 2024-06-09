App.Paper = class {
  constructor(arg) {
    if (typeof arg === "object" && arg !== null) this.data = arg;
    else this.data = App.data.papers.row(row => row.id === arg) || {};
  }
  authors(...args) {
    if (args.length > 0) {this.data.authorIds = args[0]; return this;}
    else return this.data.authorIds.map(id => new App.Person(id));
  }
  discussant(...args) {
    if (args.length > 0) {this.data.discussantId = args[0]; return this;}
    else return new App.Person(this.data.discussantId);
  }
  discussantProblems() {
    let problems = [];
    let discussant = this.discussant();
    if (!discussant.id()) problems.push("Missing");
    else {
      let session = new App.Session(this.group().session());
      // Must be attending
      if (!(discussant.attending())) problems.push(
        "Isn't attending"
      );
      // Must have nominated being a discussant in some stream
      if (discussant.discussantStreams().length === 0) problems.push(
        "Hasn't nominated to discuss"
      );
      // Must have nominated being a discussant in this stream
      if (!(discussant.discussantStreams().includes(this.stream()))) problems.push(
        "Hasn't nominated to discuss the paper's stream"
      );
      // Must not be a discussant of some other paper
      if (discussant.discussing().length >= 2) problems.push(
        "Discussing another paper"
      );
      // Must not be a chair in this session
      if (session.chairIds().includes(discussant.id())) problems.push(
        "Chairing a group in the session"
      );
      // Must not be one of the paper's authors
      if (this.data.authorIds.includes(discussant.id())) problems.push(
        "Is one of the authors"
      );
      // Must not be at one of the paper's authors' institutions
      if (this.institutions().includes(discussant.institution())) problems.push(
        "Is at one of the authors' institutions"
      );
      // Must not be an author of a sibling paper
      if (this.siblingAuthorIds().includes(discussant.id())) problems.push(
        "Is an author of a sibling paper"
      );
      // Must not be an author in a concurrent group
      if (this.group().concurrentAuthorIds().includes(discussant.id())) problems.push(
        "Is an author of a concurrent paper"
      );
    }
    return problems;
  }
  group() {
    let groupId = App.data.groups.rows().find(row => row.paperIds.includes(this.id()));
    return groupId ? new App.Group(groupId) : null;
  }
  id(...args) {
    if (args.length > 0) {this.data.id = args[0]; return this;}
    else return this.data.id;
  }
  idTitle() {
    return `${this.data.id} ${this.data.title}`;
  }
  institutions() {
    return this.authors().map(person => person.institution()).uniques();
  }
  possibleDiscussants() {
    let group = this.group();
    let session = new App.Session(group.data.session);
    let people = App.data.people.copy().rows();
    people.forEach(row => row.level = 99);
    // Level 3
    // Is attending
    let subset = people.filter(row => row.attending)
    // Has nominated being a discussant in some stream
    subset = subset.filter(row => row.discussantStreams.length > 0);
    // Is not already a discussant
    let alreadyDiscussants = App.data.papers.column("discussantId").filter(id => id > 0).uniques();
    subset = subset.filter(row => !alreadyDiscussants.includes(row.id));
    // Is not a chair in this session
    let sessionChairIds = session.chairIds(); 
    subset = subset.filter(row => !sessionChairIds.includes(row.id));
    // Is not one of the paper's authors
    subset = subset.filter(row => !this.data.authorIds.includes(row.id));
    // Is not at one of the paper's authors institutions
    let institutions = this.institutions();
    subset = subset.filter(row => !institutions.includes(row.institution));
    // Is not an author in a concurrent group
    let concurrentAuthorIds = group.concurrentAuthorIds();
    subset = subset.filter(row => !concurrentAuthorIds.includes(row.id));
    subset.forEach(row => row.level = 3);
    // Level 2
    // Is not an author of a sibling paper
    let siblingAuthorIds = this.siblingAuthorIds();
    subset = subset.filter(row => !siblingAuthorIds.includes(row.id));
    subset.forEach(row => row.level = 2);
    // Level 1
    // Has nominated being a discussant in the paper's stream
    subset = subset.filter(row => row.discussantStreams.includes(this.data.stream));
    subset.forEach(row => row.level = 1);
    // Done
    return people.map(row => ({id: row.id, level: row.level}));
  }
  siblingAuthorIds() {
    let siblingPaperIds = this.siblingPaperIds();
    return App.data.papers.rows()
      .filter(row => siblingPaperIds.includes(row.id))
      .flatMap(row => row.authorIds);
  }
  siblingPaperIds() {
    return this.group().data.paperIds.filter(id => id !== this.id());
  }
  stream(...args) {
    if (args.length > 0) {this.data.stream = args[0]; return this;}
    else return this.data.stream;
  }
  title(...args) {
    if (args.length > 0) {this.data.title = args[0]; return this;}
    else return this.data.title;
  }
}


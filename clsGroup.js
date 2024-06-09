App.Group = class {
  constructor(arg) {
    if (typeof arg === "object" && arg !== null) this.data = arg;
    else this.data = App.data.groups.row(row => row.id === arg) || {};
  }
  chair(...args) {
    if (args.length > 0) {this.data.chairId = args[0]; return this;}
    else return new App.Person(this.data.chairId);
  }
  chairProblems() {
    let problems = [];
    let chair = this.chair();
    if (!chair.id()) problems.push("Missing");
    else {
      let session = new App.Session(this.session());
      // Must be attending
      if (!(chair.attending())) problems.push(
        "Isn't attending"
      );
      // Must have nominated being a chair in some stream
      if (chair.chairStreams().length === 0) problems.push(
        "Hasn't nominated to chair"
      );
      // Must have nominated being a chair in this stream
      if (!(chair.chairStreams().includes(this.stream()))) problems.push(
        "Hasn't nominated to chair the group's stream"
      );
      // Must not be a chair of some other group
      if (chair.chairing().length >= 2) problems.push(
        "Chairing another group"
      );
      // Must not be a discussant in this session
      if (session.discussantIds().includes(chair.id())) problems.push(
        "Discussing a paper in the session"
      );
      // Must not be an author in this session
      if (session.authorIds().includes(chair.id())) problems.push(
        "Authoring a paper in the session"
      );
    }
    return problems;
  }
  concurrentAuthorIds() {
    let concurrentPaperIds = this.concurrentPaperIds();
    return App.data.papers.rows()
      .filter(row => concurrentPaperIds.includes(row.id))
      .flatMap(row => row.authorIds);
  }
  concurrentGroupIds() {
    return App.data.groups.rows()
      .filter(row => row.session === this.session())
      .filter(row => row.id !== this.id())
      .map(row => row.id);
  }
  concurrentPaperIds() {
    return App.data.groups.rows()
      .filter(row => row.session === this.session())
      .filter(row => row.id !== this.id())
      .flatMap(row => row.paperIds);
  }
  id(...args) {
    if (args.length > 0) {this.data.id = args[0]; return this;}
    else return this.data.id;
  }
  papers(...args) {
    if (args.length > 0) {this.data.paperIds = args[0]; return this;}
    else return (this.data.paperIds || []).map(id => new App.Paper(id));
  }
  possibleChairs() {
    let session = new App.Session(this.data.session);
    let people = App.data.people.copy().rows();
    people.forEach(row => row.level = 99);
    // Level 2
    // Is attending
    let subset = people.filter(row => row.attending);
    // Has nominated being a chair in some stream
    subset = subset.filter(row => row.chairStreams.length > 0);
    // Is not already a chair
    let alreadyChairs = App.data.groups.column("chairId").filter(id => id > 0).uniques();
    subset = subset.filter(row => !alreadyChairs.includes(row.id));
    // Is not a discussant in this session
    let sessionDiscussantIds = session.discussantIds(); 
    subset = subset.filter(row => !sessionDiscussantIds.includes(row.id));
    // Is not an author in this session
    let sessionAuthorIds = session.authorIds();
    subset = subset.filter(row => !sessionAuthorIds.includes(row.id));
    subset.forEach(row => row.level = 2);
    // Level 1
    // Has nominated being a chair in the groups's stream
    subset = subset.filter(row => row.chairStreams.includes(this.data.stream));
    subset.forEach(row => row.level = 1);
    // Done
    return people.map(row => ({id: row.id, level: row.level}));
  }
  session(...args) {
    if (args.length > 0) {this.data.sessionId = args[0]; return this;}
    else return this.data.session;
  }
  stream(...args) {
    if (args.length > 0) {this.data.stream = args[0]; return this;}
    else return this.data.stream;
  }
  type(...args) {
    if (args.length > 0) {this.data.type = args[0]; return this;}
    else return this.data.type;
  }
}

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
  possibleDiscussants(type = "strict") {
    let alreadyDiscussants = App.data.papers.column("discussantId").filter(id => id > 0).uniques();
    let institutions = this.institutions();
    let group = this.group();
    let session = new App.Session(group.data.session);
    let sessionPersonIds = session.personIds(); 
    let rows = App.data.people.rows();
    // Is attending
    rows = rows.filter(row => row.attending)
    // Has no role in the session
    rows = rows.filter(row => !sessionPersonIds.includes(row.id));
    // Is not at one of the paper's authors institutions
    rows = rows.filter(row => !institutions.includes(row.institution));
    // Has nominated being a discussant in some stream
    rows = rows.filter(row => row.discussantStreams.length > 0);
    // Is not already a discussant
    rows = rows.filter(row => !alreadyDiscussants.includes(row.id));
    if (type === "strict") {
      // Has nominated being a discussant in the paper's stream
      rows = rows.filter(row => row.discussantStreams.includes(this.data.stream));
    }
    return rows.map(row => new App.Person(row));
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


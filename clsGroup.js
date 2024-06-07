App.Group = class {
  constructor(arg) {
    if (typeof arg === "object" && arg !== null) this.data = arg;
    else this.data = App.data.groups.row(row => row.id === arg) || {};
  }
  chair(...args) {
    if (args.length > 0) {this.data.chairId = args[0]; return this;}
    else return new App.Person(this.data.chairId);
  }
  id(...args) {
    if (args.length > 0) {this.data.id = args[0]; return this;}
    else return this.data.id;
  }
  papers(...args) {
    if (args.length > 0) {this.data.paperIds = args[0]; return this;}
    else return (this.data.paperIds || []).map(id => new App.Paper(id));
  }
  possibleChairs(type = "strict") {
    let alreadyChairs = App.data.groups.column("chairId").filter(id => id > 0).uniques();
    let session = new App.Session(this.data.session);
    let sessionPersonIds = session.personIds(); 
    let rows = App.data.people.rows();
    // Is attending
    rows = rows.filter(row => row.attending);
    // Has no role in the session
    rows = rows.filter(row => !sessionPersonIds.includes(row.id));
    // Has nominated being a chair in some stream
    rows = rows.filter(row => row.chairStreams.length > 0);
    // Is not already a chair
    rows = rows.filter(row => !alreadyChairs.includes(row.id));
    if (type === "strict") {
      // Has nominated being a chair in the groups's stream
      rows = rows.filter(row => row.chairStreams.includes(this.data.stream));
    }
    return rows.map(row => new App.Person(row));
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

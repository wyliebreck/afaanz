App.Person = class {
  constructor(arg) {
    if (typeof arg === "object" && arg !== null) this.data = arg;
    else this.data = App.data.people.row(row => row.id === arg) || {};
  }
  attending(...args) {
    if (args.length > 0) {this.data.attending = args[0]; return this;}
    else return this.data.attending;
  }
  chairing(...args) {
    return App.data.groups.rows()
      .filter(row => row.chairId === this.data.id)
      .map(row => new App.Group(row));
  }
  chairStreams(...args) {
    if (args.length > 0) {this.data.chairStreams = args[0]; return this;}
    else return this.data.chairStreams || [];
  }
  discussantStreams(...args) {
    if (args.length > 0) {this.data.discussantStreams = args[0]; return this;}
    else return this.data.discussantStreams || [];
  }
  discussing() {
    return App.data.papers.rows()
      .filter(row => row.discussantId === this.data.id)
      .map(row => new App.Paper(row));
  }
  email(...args) {
    if (args.length > 0) {this.data.email = args[0]; return this;}
    else return this.data.email;
  }
  firstName(...args) {
    if (args.length > 0) {this.data.firstName = args[0]; return this;}
    else return this.data.firstName || "";
  }
  fullName() {
    return `${this.data.firstName} ${this.data.lastName}`;
  }
  id(...args) {
    if (args.length > 0) {this.data.id = args[0]; return this;}
    else return this.data.id;
  }
  institution(...args) {
    if (args.length > 0) {this.data.institution = args[0]; return this;}
    else return this.data.institution || "";
  }
  lastName(...args) {
    if (args.length > 0) {this.data.lastName = args[0]; return this;}
    else return this.data.lastName || "";
  }
  papers() {
    let paperIds = App.data.groups.rows()
      .filter(row => row.session > 0)
      .flatMap(row => row.paperIds);
    let papers = App.data.papers.rows()
      .filter(row => paperIds.includes(row.id))
      .filter(row => row.authorIds.includes(this.id()))
      .map(row => new App.Paper(row));
    return papers;  
  }
  position(...args) {
    if (args.length > 0) {this.data.position = args[0]; return this;}
    else return this.data.position;
  }
  reverseName() {
    return `${this.data.lastName}, ${this.data.firstName}`;
  }
}

App.Session = class {
  constructor(arg) {
    this.num = arg;
  }
  authorIds() {
    let paperIds = this.paperIds();
    return App.data.papers.rows()
      .filter(row => paperIds.includes(row.id))
      .flatMap(row => row.authorIds);
  }
  chairIds() {
    return App.data.groups.rows()
      .filter(row => row.session === this.num)
      .map(row => row.chairId);
  }
  discussantIds() {
    let paperIds = this.paperIds();
    return App.data.papers.rows()
      .filter(row => paperIds.includes(row.id))
      .map(row => row.discussantId);
  }
  paperIds() {
    return App.data.groups.rows()
      .filter(row => row.session === this.num)
      .flatMap(row => row.paperIds);
  }
  personIds() {
    return [...this.authorIds(), ...this.chairIds(), ...this.discussantIds()].uniques();
  }
}

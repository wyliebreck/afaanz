App.pageCode = (options) => {
  let id = parseInt(options.id);
  let person = App.data.people.row(row => row.id === id) || {};
  App.page.html = `
    <h1>Edit person ${person.id}</h1>
    <label>First name:</label>
    <input name="firstName" value="${person.firstName}" autofocus>
    <label>Last name:</label>
    <input name="lastName" value="${person.lastName}">
    <label>Institution:</label>
    <input name="institution" value="${person.institution}">
    <label>Position:</label>
    <input name="position" value="${person.position}">
    <label>Email:</label>
    <input name="email" value="${person.email}">
    <label>Attending:</label>
    <input name="attending" type="checkbox" ${person.attending ? "checked" : ""}>
    <label>Chair streams:</label>
    <textarea name="chairStreams">${person.chairStreams.join("\n")}</textarea>
    <label>Discussant streams:</label>
    <textarea name="discussantStreams">${person.discussantStreams.join("\n")}</textarea>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.page.onCancel()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em;}
  `;
  App.page.onOk = () => {
    person.firstName = App.page.elt.querySelector("[name='firstName']").value;
    person.lastName = App.page.elt.querySelector("[name='lastName']").value;
    person.institution = App.page.elt.querySelector("[name='institution']").value;
    person.position = App.page.elt.querySelector("[name='position']").value;
    person.email = App.page.elt.querySelector("[name='email']").value;
    person.attending = App.page.elt.querySelector("[name='attending']").checked ? 1 : 0;
    person.chairStreams = App.page.elt.querySelector("[name='chairStreams']").value.split("\n").filter(x => x > "").map(x => x.trim()).uniques().sort();
    person.discussantStreams = App.page.elt.querySelector("[name='discussantStreams']").value.split("\n").extants().map(x => x.trim()).uniques().sort();
    App.isDirty(true);
    App.goBack({id}, id);
  };
  App.page.onCancel = () => {
    App.goBack({id}, id);
  };
};
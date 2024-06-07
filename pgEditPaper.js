App.pageCode = (options) => {
  let id = parseInt(options.id);
  let paper = App.data.papers.row(row => row.id === id) || {};
  App.page.html = `
    <h1>Edit paper ${paper.id}</h1>
    <label>Title:</label>
    <input name="title" value="${paper.title}" autofocus>
    <label>Stream:</label>
    <input name="stream" value="${paper.stream}">
    <label>Discussant:</label>
    <select name="discussantId" value="${paper.discussantId}">
      ${App.peopleOptions(paper.discussantId)}
    </select>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.page.onCancel()">Cancel</button>
    </div>
  `;
  App.page.css = `
    #page {max-width: 35em;}
  `;
  App.page.onOk = () => {
    paper.title = App.page.elt.querySelector(`[name="title"]`).value;
    paper.stream = App.page.elt.querySelector(`[name="stream"]`).value;
    paper.discussantId = App.page.elt.querySelector(`[name="discussantId"]`).value*1;
    App.isDirty(true);
    App.goBack({id}, id);
  };
  App.page.onCancel = () => {
    App.goBack({id}, id);
  };
};

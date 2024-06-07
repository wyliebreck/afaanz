App.pageCode = () => {
  let html = `
    <h1>Take a snapshot</h1>
    <p>You are about to take a snapshot of the data.</p>
  `;
  if (App.isDirty()) html += `
    <p>You have unsaved changes. If you'd like to include them in the snapshot, you can save them before taking the snapshot.</p>
    <p class="center"><a onclick="App.getPage('pgSave.js', {setBackTo: true})">Save changes</a></p>
  `;
  html += `
    <p>The snapshot will be saved in a new folder, named with the current date and time. Alternatively, you can give it a custom name:</p>
    <p><input name="name" autofocus></p>
    <div class="buttons">
      <button onclick="App.page.onOk()">Ok</button>
      <button onclick="App.goBack()">Cancel</button>
    </div>
  `;
  App.page.html = html;
  App.page.css = `
    #page {max-width: 35em}
  `;
  App.page.onOk = async () => {
    // Get and check the name
    let name = App.page.elt.querySelector(`[name="name"]`).value;
    if (!name) {
      let t = new Date();
      name = `${t.getFullYear().toString()}-${(t.getMonth()+1).toString().padStart(2, "0")}-${t.getDate()}-${t.getHours().toString().padStart(2, "0")}${t.getMinutes().toString().padStart(2, "0")}${t.getSeconds().toString().padStart(2, "0")}`;
    }
    let nameOk = true;
    const snapshotsHandle = await App.handle.getDirectoryHandle("snapshots", {create: true});
    for await (let handle of snapshotsHandle.values()) {
      if (handle.name === name) {
        alert("A snapshot with that name already exists");
        nameOk = false;
      }
    }
    // If name is okay, take the snapshot
    if (nameOk) {
      const dataHandle = await App.handle.getDirectoryHandle("data");
      const snapshotHandle = await snapshotsHandle.getDirectoryHandle(name, {create: true});
      App.showStatus(`Snapshotting the data ...`);
      for await (const [fromName, fromHandle] of dataHandle.entries()) {
        let fromFile = await fromHandle.getFile();
        let fromText = await fromFile.text();
        let toHandle = await snapshotHandle.getFileHandle(fromName, {create: true});
        const writable = await toHandle.createWritable();
        await writable.write(fromText);
        await writable.close();
      }
      App.showStatus("Done");
      App.goBack();  
    }
  };
};

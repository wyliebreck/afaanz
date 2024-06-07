const App = {
  assignments: [],
  data: {},
  page: {},
  pages: {},
};
window.addEventListener("beforeunload", function(evt){
  if (App.isDirty()) {
    evt.preventDefault();
    evt.returnValue = true;
    return "";
  }
});
window.addEventListener("load", function(){
  document.querySelectorAll("header button, nav a").forEach(elt => {
    elt.addEventListener("click", () => App.getPage(elt.id, {setBackTo: true}));
  });
});
App.checkHandle = () => {
  return new Promise((resolve, reject) => {
    if (App.handle) resolve();
    else {
      let db = indexedDB.open("afaanz");
      db.onupgradeneeded = (event) => event.target.result.createObjectStore("options");
      db.onsuccess = () => {
        db.result.transaction("options").objectStore("options").get("handle").onsuccess = async (event) => {
          App.handle = await window.showDirectoryPicker({startIn: event.target.result});
          indexedDB.open("afaanz").onsuccess = (event) => {
            event.target.result.transaction("options", "readwrite").objectStore("options").put(App.handle, "handle")
          };
          await App.readData();
          resolve();
        };
      };
    }
  });
};
App.addChange = (change, from, to) => {
  let exists = App.data.changes.rows().some(row => row.change === change && row.from === from && row.to === to);
  if (!exists) App.data.changes.data.push({change: change, from: from, to: to});
}
App.getPage = async (path, params = {}, hash) => {
  await App.checkHandle();
  // Highlight the link
  document.querySelectorAll("header button, nav a").forEach(elt => {
    if (elt.id === path) elt.classList.add("selected");
    else elt.classList.remove("selected");
  });
  // Remember the old path
  let oldPath = App.page.path;
  // Clear the current page
  App.page = {};
  // Set the new path
  App.page.path = path;
  // Set the backTo
  if (params.setBackTo) App.pageValue("backTo", oldPath);
  // Load the script
  let script = document.createElement("script");
  script.id = "pageCode";
  script.src = path;
  script.onload = async () => {
    await App.pageCode(params);
    // Create the page element
    App.page.elt = document.createElement("div");
    App.page.elt.id = "page";
    // Set the html
    App.page.elt.innerHTML = App.page.html;
    // Add any css
    if (App.page.css) {
      let elt = document.createElement("style");
      elt.textContent = App.page.css;
      App.page.elt.appendChild(elt);
    }
    // Add it to the document
    if (document.getElementById("page")) document.getElementById("page").replaceWith(App.page.elt);
    else document.querySelector("main").appendChild(App.page.elt);
    // Highlight the hash
    App.select(hash);
    // Select the autofocus
    page.querySelector("[autofocus]")?.select();
    // Make textareas autosize
    document.querySelectorAll("main textarea").forEach(function(elt){
      elt.style.height = "1em";
      elt.style.height = elt.scrollHeight+"px";
      elt.addEventListener("input", function(){this.style.height = this.scrollHeight+"px";});
      elt.selectionStart = elt.selectionEnd = elt.value.length;
    });
    // Make tables sortable
    onclick="App.sortTable(event)"
    document.querySelectorAll("main table.headers tr:first-child").forEach(elt => {
      elt.addEventListener("click", evt => App.sortTable(evt));
    });
    // Run any opening code
    if (App.page.onLoad) App.page.onLoad();
  }
  document.getElementById("pageCode").replaceWith(script);
};
App.goBack = (params = {}, hash) => {
  let path = App.pageValue("backTo");
  if (path) App.getPage(path, params, hash);
  else App.getPage("pgView.js");
};
App.isDirty = (newVal) => {
  if (newVal === undefined) return App.isDirty.val;
  else {
    if (newVal) {App.isDirty.val = true; document.body.classList.add("dirty");}
    else {App.isDirty.val = false; document.body.classList.remove("dirty");}
  }
};
App.newId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let array = new Uint8Array(4);
  crypto.getRandomValues(array);
  return [0, 1, 2, 3].map(i => array[i]).map(num => num % 62).map(num => chars[num]).join("");
};
App.pageValue = (name, value) => {
  let path = App.page.path;
  App.pages[path] = App.pages[path] || {};
  if (value !== undefined) App.pages[path][name] = value;
  return App.pages[path][name];
}
App.peopleOptions = (defaultValue) => {
  let options = `<option value="0"></option>`;
  App.data.people.copy()
    .sort("lastName", "firstName")
    .rows()
    .forEach(row => {
      let selected = row.id === defaultValue ? "selected" : "";
      options += `<option value="${row.id}" ${selected}>${row.lastName}, ${row.firstName} (${row.institution})</option>`;
    });
  return options;
};
App.readData = async () => {
  App.showStatus(`Reading data ...`);
  const dataHandle = await App.handle.getDirectoryHandle("data");
  await Promise.all(["changes", "groups", "papers", "people"].map(async (name) => {
    const fileHandle = await dataHandle.getFileHandle(`${name}.json`, {create: true});
    const file = await fileHandle.getFile();
    const text = (await file.text()) || "[]";
    App.data[name] = new Table(JSON.parse(text));
  }));
  App.showStatus("Done");
};
App.select = (hash) => {
  if (hash) {
    let elt = document.querySelector(`main [id="${hash}"]`);
    if (elt) {
      elt.classList.add("selected");
      elt.scrollIntoView({block: "center"});
    }
  };
};
App.showMatches = (needle, haystack) => {
  const regex = new RegExp(needle, "ig");
  return haystack.replace(regex, match => `<span class="match">${match}</span>`);
};
App.showStatus = (text, duration = null) => {
  clearTimeout(App.statusTimeout);
  document.querySelector("footer").textContent = text;
  if (duration) App.statusTimeout = setTimeout(() => {
    document.querySelector("footer").textContent = null;
  }, duration);
};
App.sortTable = (evt) => {
  let td = evt.target.closest("td");
  let tr = evt.target.closest("tr");
  let table = evt.target.closest("table");
  let colNum = [...tr.children].indexOf(td) + 1;
  let direction = td.getAttribute("dir") === "asc" ? "desc" : "asc";
  let rows = [...table.querySelectorAll("tr")];
  table.prepend(rows.shift());
  rows.sort((a, b) => {
    let aVal = a.querySelector(`td:nth-child(${colNum})`).textContent;
    let bVal = b.querySelector(`td:nth-child(${colNum})`).textContent;
    if (!isNaN(aVal) && !isNaN(bVal)) return aVal - bVal;
    else return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  });
  if (direction === "desc") rows.reverse();
  rows.forEach(row => table.appendChild(row));
  tr.querySelectorAll("td").forEach(x => x.removeAttribute("dir"));
  td.setAttribute("dir", direction);
};
App.updateAll = () => {
  App.data.changes.rows().forEach(row => {
    if (row.change === "stream") App.updateStream(row.from, row.to);
    if (row.change === "institution") App.updateInstitution(row.from, row.to);
  });
  App.isDirty(true);
};
App.updateInstitution = (oldName, newName) => {
  // Update people
  App.data.people.rows().forEach(row => {
    row.institution = row.institution === oldName ? newName : row.institution;
  });
};
App.updateStream = (oldName, newName) => {
  // Update people
  App.data.people.rows().forEach(row => {
    row.chairStreams = row.chairStreams.map(stream => stream === oldName ? newName : stream).uniques().extants().sort();
    row.discussantStreams = row.discussantStreams.map(stream =>  stream === oldName ? newName : stream).uniques().extants().sort();
  });
  // Update papers
  App.data.papers.rows().forEach(row => {
    row.stream = row.stream === oldName ? newName : row.stream;
  });
  // Update groups
  App.data.groups.rows().forEach(row => {
    row.stream = row.stream === oldName ? newName : row.stream;
  });
};
App.writeData = async () => {
  App.showStatus(`Writing data ...`);
  const dataHandle = await App.handle.getDirectoryHandle("data");
  let names = Object.keys(App.data);
  await Promise.all(names.map(async (name) => {
    const fileHandle = await dataHandle.getFileHandle(`${name}.json`, {create: true});
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(App.data[name].rows()));
    await writable.close();
  }));
  App.isDirty(false);
  App.showStatus("Done");
};

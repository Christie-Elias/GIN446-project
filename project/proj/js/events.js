const categoryMap = {
  window: "Window", load: "Window", unload: "Window", resize: "Window", scroll: "Window",
  mouse: "Mouse", click: "Mouse", dblclick: "Mouse", wheel: "Mouse", contextmenu: "Mouse",
  key: "Keyboard",
  input: "Form", change: "Form", submit: "Form", reset: "Form", select: "Form",
  copy: "Clipboard", cut: "Clipboard", paste: "Clipboard",
  drag: "Drag & Drop", drop: "Drag & Drop",
  touch: "Touch",
  pointer: "Pointer",
  play: "Media", pause: "Media", ended: "Media", volume: "Media",
  animation: "Animation/Transition", transition: "Animation/Transition",
  focus: "Focus", blur: "Focus",
  dom: "DOM"
};

function categorize(name) {
  const base = name.replace(/^on/, "").toLowerCase();
  for (const key in categoryMap) {
    if (base.includes(key)) return categoryMap[key];
  }
  return "Other";
}

function getAllEvents() {
  const set = new Set();
  for (const prop in window) if (prop.startsWith("on")) set.add(prop);
  const el = document.createElement("div");
  for (const prop in el) if (prop.startsWith("on")) set.add(prop);
  return Array.from(set).sort();
}

function supportedTagsFor(eventName) {
  const base = eventName.replace(/^on/, "").toLowerCase();

  if (base.includes("load") || base.includes("unload") || base.includes("resize") || base.includes("scroll"))
    return "&lt;body&gt;, &lt;iframe&gt;, &lt;img&gt;, &lt;link&gt;, &lt;script&gt;";

  if (base.includes("click") || base.includes("mouse") || base.includes("contextmenu"))
    return "All visible elements";

  if (base.includes("key"))
    return "Focusable elements";

  if (base.includes("input") || base.includes("change") || base.includes("submit") || base.includes("reset") || base.includes("select"))
    return "&lt;form&gt;, &lt;input&gt;, &lt;select&gt;, &lt;textarea&gt;";

  if (base.includes("copy") || base.includes("cut") || base.includes("paste"))
    return "&lt;input&gt;, &lt;textarea&gt;, [contenteditable]";

  if (base.includes("drag") || base.includes("drop"))
    return "Draggable elements";

  if (base.includes("touch"))
    return "All touchable elements (mobile)";

  if (base.includes("pointer"))
    return "Pointer-interactive elements";

  if (base.includes("play") || base.includes("pause") || base.includes("volume") || base.includes("ended") || base.includes("loadeddata"))
    return "&lt;audio&gt;, &lt;video&gt;";

  if (base.includes("animation") || base.includes("transition"))
    return "Elements with CSS animations or transitions";

  if (base.includes("focus") || base.includes("blur"))
    return "&lt;input&gt;, &lt;button&gt;, &lt;a&gt;, focusable elements";

  if (base.includes("dom"))
    return "Document or element nodes";

  return "All elements";
}

function referenceLinkFor(eventName) {
 
  const base = eventName.toLowerCase().replace(/^on/, "");

  // Known missing W3Schools pages
  const missingOnW3 = [ 
    "transition", "pointer", "touch", "wheel",
    "volume", "focusin", "focusout","aux","appinstalled","cance;","before",
    "message","webkit"

  ];


 const isMissing = missingOnW3.some(x => base.includes(x));

if (base === "beforeunload") {
  return {
    url: `https://www.w3schools.com/jsref/event_${eventName}.asp`,
    label: "W3Schools"
  };
} else if (isMissing) {
  return {
    url: `https://developer.mozilla.org/en-US/docs/Web/API/Element/${base}_event`,
    label: "MDN Docs"
  };
} else if (base.includes("animation")) {
  return {
    url: `https://www.w3schools.com/jsref/event_${base}.asp`,
    label: "W3Schools"
  };
} else {
  return {
    url: `https://www.w3schools.com/jsref/event_${eventName}.asp`,
    label: "W3Schools"
  };
}

}


function createRow(eventName) {
  const category = categorize(eventName);
  const base = eventName.replace(/^on/, "").toLowerCase();

  let description = "";
  if (base.includes("click")) description = "Triggered when the user clicks an element.";
  else if (base.includes("keydown") || base.includes("keyup") || base.includes("keypress"))
    description = "Fires when a key is pressed or released.";
  else if (base.includes("load")) description = "Fires when a resource or page finishes loading.";
  else if (base.includes("error")) description = "Fires when an error occurs while loading a resource.";
  else if (base.includes("input")) description = "Fires when user input changes in a form field.";
  else if (base.includes("submit")) description = "Triggered when a form is submitted.";
  else if (base.includes("focus")) description = "Triggered when an element gains or loses focus.";
  else if (base.includes("play") || base.includes("pause")) description = "Triggered when media playback starts or pauses.";
  else if (base.includes("scroll")) description = "Triggered when an element’s scroll position changes.";
  else description = `Fires when the '${base}' event occurs.`;

  const supportedTags = supportedTagsFor(eventName);
  const link = referenceLinkFor(eventName);
  const w3Link = link.url;


  return { name: eventName, category, description, supportedTags, w3Link };
}

function renderTable() {
  const tbody = document.querySelector("#eventsTable tbody");
  const search = document.querySelector("#search").value.toLowerCase();
  const filterCat = document.querySelector("#category").value;
  tbody.innerHTML = "";

  const allEvents = getAllEvents();
  const rows = allEvents.map(createRow);

  let count = 0;
  for (const row of rows) {
    if (filterCat && row.category !== filterCat) continue;
    if (search && !(row.name.toLowerCase().includes(search) || row.description.toLowerCase().includes(search))) continue;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.category}</td>
      <td>${row.description}</td>
      <td>${row.supportedTags}</td>
      <td><a href="${row.w3Link}" target="_blank" rel="noopener">View</a></td>
    `;
    tbody.appendChild(tr);
    count++;
  }

  const rowCountEl = document.getElementById("rowCount");
  rowCountEl.textContent = count === 1 ? `Showing 1 event` : `Showing ${count} events`;
}

document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const allEvents = getAllEvents().map(createRow);

  const categories = Array.from(new Set(allEvents.map(e => e.category))).sort();
  for (const cat of categories) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }

  document.getElementById("search").addEventListener("input", renderTable);
  categorySelect.addEventListener("change", renderTable);
  renderTable();
});
const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const historyList = document.getElementById("history");

let history = [];

function detectType(value) {
  const clean = value.trim();
  if (clean.includes("facebook.com") || clean.startsWith("http")) return "url";
  if (/^d+$/.test(clean)) return "uid";
  if (/^[0-9+-s()]+$/.test(clean)) return "phone";
  return null;
}

function normalizePhone(value) {
  let digits = value.replace(/D/g, "");
  if (digits.startsWith("0")) digits = "972" + digits.slice(1);
  return digits;
}

async function search() {
  const value = input.value.trim();
  if (!value) return;

  const type = detectType(value);

  if (!type) {
    result.innerHTML = "קלט לא תקין";
    return;
  }

  let normalized = value;
  if (type === "phone") normalized = normalizePhone(value);

  const response = await fetch("data.json");
  const data = await response.json();

  let found = null;

  if (type === "uid") {
    found = data.find(item => String(item.uid) === value);
  } else if (type === "phone") {
    found = data.find(item => String(item.phone) === normalized);
  } else if (type === "url") {
    found = data.find(item => String(item.url) === value);
  }

  history.unshift({ query: value, type, found: !!found });
  if (history.length > 5) history.pop();

  renderHistory();

  if (found) {
    result.innerHTML = `
      <strong>נמצא!</strong><br>
      UID: ${found.uid}<br>
      שם: ${found.firstname || ""} ${found.lastname || ""}<br>
      טלפון: ${found.phone || ""}<br>
      URL: ${found.url || ""}
    `;
  } else {
    result.innerHTML = "לא נמצא";
  }
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.query} - ${item.type} - ${item.found ? "נמצא" : "לא נמצא"}`;
    historyList.appendChild(li);
  });
}

btn.addEventListener("click", search);

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const categoryFilter = document.getElementById("categoryFilter");

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveSelectedCategory(category) {
  selectedCategory = category;
  localStorage.setItem("selectedCategory", category);
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categorySelector.innerHTML = "";
  categoryFilter.innerHTML = "";

  const allOption1 = document.createElement("option");
  allOption1.value = "all";
  allOption1.textContent = "All Categories";
  categorySelector.appendChild(allOption1);

  const allOption2 = document.createElement("option");
  allOption2.value = "all";
  allOption2.textContent = "All Categories";
  categoryFilter.appendChild(allOption2);

  categories.forEach(cat => {
    const option1 = document.createElement("option");
    option1.value = cat;
    option1.textContent = cat;
    categorySelector.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = cat;
    option2.textContent = cat;
    categoryFilter.appendChild(option2);
  });

  categoryFilter.value = selectedCategory;
  categorySelector.value = selectedCategory;
  filterQuotes();
}

function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedCategory(selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
});

document.getElementById("newQuote").addEventListener("click", () => {
  const selected = categorySelector.value;
  saveSelectedCategory(selected);

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
});

function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}
document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// ✅ Simulated server sync
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
setInterval(syncWithServer, 30000);

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    const formatted = serverQuotes.map(q => ({
      text: q.title,
      category: "server"
    }));

    const localTexts = new Set(quotes.map(q => q.text));
    const newQuotes = formatted.filter(q => !localTexts.has(q.text));

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      notifyUser(`${newQuotes.length} new quotes synced from server.`);
    }
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#fffae6";
  note.style.border = "1px solid #ccc";
  note.style.padding = "0.5rem";
  note.style.marginTop = "1rem";
  document.body.appendChild(note);
}

// ✅ Initialize
populateCategories();
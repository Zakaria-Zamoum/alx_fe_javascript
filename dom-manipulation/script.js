// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const categoryFilter = document.getElementById("categoryFilter");
const notificationArea = document.getElementById("notificationArea");

// Track selected category
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Server URL (mock API)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Save quotes and selected category
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveSelectedCategory(category) {
  selectedCategory = category;
  localStorage.setItem("selectedCategory", category);
}

// Populate dropdowns
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

// Filter quotes
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

// Add quote
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");

  postQuoteToServer(newQuote);
});

// Show quote
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

// Export quotes
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

// Import quotes
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

// ✅ Fetch quotes from server
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const serverQuotes = await response.json();
  return serverQuotes.map(q => ({
    text: q.title,
    category: "server"
  }));
}

// ✅ Post quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to post quote:", err);
  }
}

// ✅ Sync quotes with server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localTexts = new Set(quotes.map(q => q.text));
    const newQuotes = serverQuotes.filter(q => !localTexts.has(q.text));

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server!");
    }
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

// ✅ Notification UI
function showNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#fffae6";
  note.style.border = "1px solid #ccc";
  note.style.padding = "0.5rem";
  note.style.marginTop = "1rem";
  notificationArea.innerHTML = "";
  notificationArea.appendChild(note);
}

// ✅ Periodic sync
setInterval(syncQuotes, 30000);

// ✅ Initialize
populateCategories();
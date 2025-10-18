let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes and filter
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveFilter(category) {
  localStorage.setItem("lastFilter", category);
}
function loadFilter() {
  return localStorage.getItem("lastFilter") || "all";
}

// Populate both dropdowns
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const options = `<option value="all">All Categories</option>` +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  categorySelector.innerHTML = options;
  categoryFilter.innerHTML = options;

  categoryFilter.value = loadFilter();
  filterQuotes();
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  saveFilter(selected);

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

// Add new quote
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

// Show random quote from categorySelector
document.getElementById("newQuote").addEventListener("click", () => {
  const selected = categorySelector.value;
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

// Export quotes to JSON
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

// Import quotes from JSON
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

// Initialize
populateCategories();
// Load quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes and selected filter
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveFilter(category) {
  localStorage.setItem("lastFilter", category);
}
function loadFilter() {
  return localStorage.getItem("lastFilter") || "all";
}

// ✅ Extract unique categories and populate dropdowns using appendChild
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

  // ✅ Restore last selected category
  categoryFilter.value = loadFilter();
  filterQuotes();
}

// ✅ Filter quotes and update display
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

// ✅ Add quote and refresh categories
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

// ✅ Show quote from categorySelector
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

// ✅ Export quotes
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

// ✅ Import quotes
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

// ✅ Initialize
populateCategories();
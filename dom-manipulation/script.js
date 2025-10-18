// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportQuotes");
const importInput = document.getElementById("importFile");

// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create the form dynamically
function createAddQuoteForm() {
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="newQuoteText" placeholder="Enter quote text" />
    <input type="text" id="newQuoteCategory" placeholder="Enter category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Add a new quote and update storage
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategoryOptions();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// Update dropdown with unique categories
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelector.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelector.appendChild(option);
  });
}

// Show a random quote and store it in sessionStorage
function showRandomQuote() {
  const selectedCategory = categorySelector.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Load last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" — ${lastQuote.category}`;
  }
}

// Export quotes to JSON file
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
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

// Initialize app
updateCategoryOptions();
createAddQuoteForm();
loadLastViewedQuote();

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);
importInput.addEventListener("change", importFromJsonFile);
// Export quotes to JSON file
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
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

// Event listeners for export/import
document.getElementById("exportQuotes").addEventListener("click", exportQuotesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
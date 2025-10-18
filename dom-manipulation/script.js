// Initial quotes array
const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Design is intelligence made visible.", category: "design" },
  { text: "Simplicity is the soul of efficiency.", category: "productivity" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelector = document.getElementById("categorySelector");
const formContainer = document.getElementById("formContainer");

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

// Add a new quote to the array and update DOM
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
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

// Show a random quote based on selected category
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
}

// Initialize
updateCategoryOptions();
createAddQuoteForm();

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
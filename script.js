const totalAmount = document.getElementById("total-amount");
const userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");

const errorMessage = document.getElementById("budget-error");
const productError = document.getElementById("product-error");

const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

let budget = 0, expenditure = 0;
let expenses = []; // Array for expense list

// Load data from localStorage
window.onload = () => {
  let savedBudget = localStorage.getItem("budget");
  let savedExpenditure = localStorage.getItem("expenditure");
  let savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (savedBudget) {
    budget = parseInt(savedBudget);
    amount.innerText = budget;
  }
  if (savedExpenditure) {
    expenditure = parseInt(savedExpenditure);
    expenditureValue.innerText = expenditure;
  }
  balanceValue.innerText = budget - expenditure;

  expenses = savedExpenses;
  expenses.forEach(exp => addExpenseToList(exp.title, exp.value, false));
};

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenditure", expenditure);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add expense to UI + storage
function addExpenseToList(expenseTitle, expenseValue, save = true) {
  let item = document.createElement("div");
  item.classList.add("list-item");
  item.innerHTML = `
    <span>${expenseTitle} - $${expenseValue}</span>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;
  list.appendChild(item);

  // Delete functionality
  item.querySelector(".delete").addEventListener("click", () => {
    expenditure -= expenseValue;
    expenditureValue.innerText = expenditure;
    balanceValue.innerText = budget - expenditure;
    list.removeChild(item);

    // Remove from array + update storage
    expenses = expenses.filter(e => !(e.title === expenseTitle && e.value === expenseValue));
    updateLocalStorage();
  });

  // Edit functionality
  item.querySelector(".edit").addEventListener("click", () => {
    productTitle.value = expenseTitle;
    userAmount.value = expenseValue;
    expenditure -= expenseValue;
    expenditureValue.innerText = expenditure;
    balanceValue.innerText = budget - expenditure;
    list.removeChild(item);

    expenses = expenses.filter(e => !(e.title === expenseTitle && e.value === expenseValue));
    updateLocalStorage();
  });

  if (save) {
    expenses.push({ title: expenseTitle, value: expenseValue });
    updateLocalStorage();
  }
}

// Set Budget
totalAmountButton.addEventListener("click", () => {
  let temp = parseInt(totalAmount.value);
  if (isNaN(temp) || temp <= 0) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
    budget = temp;
    amount.innerText = budget;
    balanceValue.innerText = budget - expenditure;
    totalAmount.value = "";
    updateLocalStorage();
  }
});

// Add Expense
checkAmountButton.addEventListener("click", () => {
  let expenseTitle = productTitle.value.trim();
  let expenseValue = parseInt(userAmount.value);

  if (expenseTitle === "" || isNaN(expenseValue) || expenseValue <= 0) {
    productError.style.display = "block";
    return;
  }
  productError.style.display = "none";

  expenditure += expenseValue;
  balanceValue.innerText = budget - expenditure;
  expenditureValue.innerText = expenditure;

  addExpenseToList(expenseTitle, expenseValue);

  productTitle.value = "";
  userAmount.value = "";
});

     // Restrictions ON by default
let restrictionsEnabled = true;

// Disable Right Click
document.addEventListener("contextmenu", e => {
  if (restrictionsEnabled) e.preventDefault();
});

// Disable DevTools keys
document.addEventListener("keydown", e => {
  if (restrictionsEnabled) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C")) ||
      (e.ctrlKey && (e.key.toLowerCase() === "u")) ||
      (e.ctrlKey && (e.key.toLowerCase() === "s"))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  // Secret Shortcut → Ctrl + Alt + O to disable restrictions
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "o") {
    restrictionsEnabled = false;
    alert("🔓 Restrictions Disabled!");
  }

  // New Shortcut → Ctrl + Alt + P to re-enable restrictions
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "p") {
    restrictionsEnabled = true;
    alert("🔒 Restrictions Enabled!");
  }
});
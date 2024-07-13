const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);

  
  addTransactionDOM(transaction);

  updateValues();

  // Update localStorage
  updateLocalStorage();

  // Send AJAX request to add transaction to the database
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'process_form.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
      // Assuming response is "Transaction added successfully."
      alert(xhr.responseText);
    }
  };
  xhr.send(`text=${transaction.text}&amount=${transaction.amount}`);

  // Clear input fields after adding transaction
  text.value = '';
  amount.value = '';
}

// Function to generate a random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add transaction to the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  list.appendChild(item);
}

// Function to update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  // Update localStorage and UI
  updateLocalStorage();
  init(); // Re-render transactions
}

// Function to update localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize the application
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener for form submission
form.addEventListener('submit', addTransaction);

// Initialize the application on page load
init();
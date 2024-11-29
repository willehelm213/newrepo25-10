const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const form = document.querySelector('#form');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const transactionUl = document.querySelector("#transactions");

// Recupera transações do localStorage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Função para remover transações
const removeTransaction = ID => { 
  transactions = transactions.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
}

// Função para adicionar transação no DOM
const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;
  transactionUl.append(li);
};

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(transaction => transaction.amount);
  const income = transactionsAmounts.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2);
  const expense = Math.abs(transactionsAmounts.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2);
  const total = transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
  transactionUl.innerHTML = ''; 
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => {
  return Math.floor(Math.random() * 1000);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const transName = inputTransactionName.value.trim(); 
  const transAmount = inputTransactionAmount.value.trim(); 

  if (transName === '' || transAmount === '') {
    alert('Por gentileza preencha tanto o nome quanto o valor da transação!!!');
    return;
  }

  const transaction = {
    id: generateID(), 
    name: transName, 
    amount: Number(transAmount) 
  };

  transactions.push(transaction);
  init();
  updateLocalStorage();

  // Limpa os campos de entrada
  inputTransactionAmount.value = ''; 
  inputTransactionName.value = ''; 
});

// Inicializa a aplicação ao carregar
init();
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addBtn = document.getElementById('addBtn');
const transactions = document.getElementById('transactions');
const balance = document.getElementById('balance');
const ctx = document.getElementById('chart').getContext('2d');

let data = JSON.parse(localStorage.getItem('transactions')) || [];

addBtn.addEventListener('click', () => {
  if (!text.value || !amount.value) return alert("Enter details");
  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };
  data.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(data));
  text.value = '';
  amount.value = '';
  render();
});

function render() {
  transactions.innerHTML = '';
  let total = 0, income = 0, expense = 0;
  data.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.text}: ₹${t.amount}`;
    if (t.amount < 0) li.style.color = "red";
    li.addEventListener('click', () => remove(t.id));
    transactions.appendChild(li);
    total += t.amount;
    if (t.amount > 0) income += t.amount; else expense += Math.abs(t.amount);
  });
  balance.textContent = total;
  updateChart(income, expense);
}

function remove(id) {
  data = data.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(data));
  render();
}

let chart;
function updateChart(income, expense) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    }
  });
}

render();

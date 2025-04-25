let order = [];

function addItem() {
  const price = parseInt(document.getElementById("priceInput").value.replace(/,/g, ''));
  if (!price) return;

  const item = { price: price, quantity: 1 };
  order.push(item);
  updateOrderList();
  document.getElementById("priceInput").value = '';
}

function updateOrderList() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = '';
  order.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '10px';
    div.style.marginBottom = '10px';

    div.innerHTML = `
      <span style="width: 80px; font-size: 18px;">¥${formatNumberWithCommas(item.price)}</span>
      <input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${index}, this.value)" style="width: 60px; height: 40px; font-size: 16px; padding: 5px;">
      <button onclick="removeItem(${index})" style="height: 40px; padding: 0 16px; background-color: #e67e22; color: white; border: none; border-radius: 6px; font-size: 14px;">削除</button>
    `;
    orderList.appendChild(div);
  });
  updateTotalPrice();
}

function changeQuantity(index, value) {
  order[index].quantity = parseInt(value);
  updateTotalPrice();
}

function removeItem(index) {
  order.splice(index, 1);
  updateOrderList();
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateTotalPrice() {
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("totalPrice").textContent = `合計金額: ¥${formatNumberWithCommas(total)}`;
}

function submitOrder() {
  fetch('submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  .then(response => response.text())
  .then(data => {
    alert("注文を保存しました: " + data);
    order = [];
    updateOrderList();
  });
}

function appendNumber(num) {
  const input = document.getElementById("priceInput");
  if (input.value === "0") {
    input.value = num;
  } else {
    input.value = formatNumberWithCommas(input.value.replace(/,/g, '') + num);
  }
}

function clearInput() {
  const input = document.getElementById("priceInput");
  const newValue = input.value.replace(/,/g, '').slice(0, -1);
  input.value = formatNumberWithCommas(newValue);
}

function clearAllInput() {
  document.getElementById("priceInput").value = '';
  order = [];
  updateOrderList();
}

let order = [];

function appendNumber(num) {
  checkSequence(num);

  const input = document.getElementById("priceInput");
  let currentValue = input.value.replace(/,/g, '');

  if ((num === 0 || num === "00") && currentValue === "") return;

  let newValue = currentValue + num;
  if (/^0+/.test(newValue)) {
    newValue = newValue.replace(/^0+/, "0");
  }

  input.value = formatNumberWithCommas(newValue);
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

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addItem() {
  const price = parseInt(document.getElementById("priceInput").value.replace(/,/g, ''));
  if (!price) return;
  const item = { price: price, quantity: 1 };
  order.push(item);
  updateOrderList();
  document.getElementById("priceInput").value = '';
}

function changeQuantity(index, value) {
  order[index].quantity = parseInt(value);
  updateTotalPrice();
}

function removeItem(index) {
  order.splice(index, 1);
  updateOrderList();
}

function updateOrderList() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = '';
  order.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <span>¥${formatNumberWithCommas(item.price)}</span>
      <input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${index}, this.value)">
      <button onclick="removeItem(${index})">削除</button>
    `;
    orderList.appendChild(div);
  });
  updateTotalPrice();
}

function updateTotalPrice() {
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxOption = document.querySelector('input[name="taxOption"]:checked').value;
  let displayTotal = total;
  if (taxOption === 'taxIncluded') {
    displayTotal = Math.round(total * 1.1);
  }
  document.getElementById("totalPrice").textContent = `合計金額: ¥${formatNumberWithCommas(displayTotal)}`;
}

function submitOrder() {
  fetch('submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  }).then(res => res.text()).then(data => {
    alert("注文を保存しました: " + data);
    order = [];
    updateOrderList();
  });
}

// 隠しコマンド
const secretSequence = ["1", "2", "3", "4"];
let sequenceIndex = 0;

function checkSequence(num) {
  if (num.toString() === secretSequence[sequenceIndex]) {
    sequenceIndex++;
    if (sequenceIndex === secretSequence.length) {
      const overlay = document.getElementById("fade-overlay");
      const loadingText = document.getElementById("tetris-loading");
      overlay.classList.add("active");
      loadingText.classList.add("active");
      setTimeout(() => {
        window.location.href = "テトリス/index.html";
      }, 1000);
      sequenceIndex = 0;
    }
  } else {
    sequenceIndex = 0;
  }
}

// ✅ 日時更新
function updateDateTime() {
  const now = new Date();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const formatted = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}） ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  document.getElementById("datetime").textContent = `本日の営業日: ${formatted}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

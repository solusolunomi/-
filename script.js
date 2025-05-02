// 注文データを格納する配列
let order = [];

// 商品を追加する関数
function addItem() {
  const price = parseInt(document.getElementById("priceInput").value.replace(/,/g, ''));
  if (!price) return; // 無効な入力は無視

  const item = { price: price, quantity: 1 };
  order.push(item); // 商品を注文リストに追加
  updateOrderList(); // 注文リストを更新
  document.getElementById("priceInput").value = ''; // 入力フィールドをクリア
}

// 注文リストを更新する関数
function updateOrderList() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = ''; // リストをクリア
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
  updateTotalPrice(); // 合計金額を更新
}

// 数量を変更する関数
function changeQuantity(index, value) {
  order[index].quantity = parseInt(value);
  updateTotalPrice();
}

// 注文を削除する関数
function removeItem(index) {
  order.splice(index, 1);
  updateOrderList();
}

// 数値をカンマ区切りにフォーマットする関数
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 合計金額を更新する関数
function updateTotalPrice() {
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxOption = document.querySelector('input[name="taxOption"]:checked').value;
  let displayTotal = total;

  if (taxOption === 'taxIncluded') {
    displayTotal = Math.round(total * 1.1); // 税込み計算（10%）
  }

  document.getElementById("totalPrice").textContent = `合計金額: ¥${formatNumberWithCommas(displayTotal)}`;
}

// 注文をサーバーに送信する関数
function submitOrder() {
  fetch('submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  .then(response => response.text())
  .then(data => {
    alert("注文を保存しました: " + data);
    order = []; // 注文データをリセット
    updateOrderList();
  });
}

// 数字を入力フィールドに追加する関数
// 数字を入力フィールドに追加する関数
function appendNumber(num) {
  const input = document.getElementById("priceInput");
  const currentValue = input.value.replace(/,/g, '');

  if (currentValue === "0") {
    input.value = num; // 先頭が0の場合は新しい数字に置き換える
  } else if (currentValue === "00") {
    input.value = num; // 先頭が00の場合も新しい数字に置き換える
  } else {
    input.value = formatNumberWithCommas(currentValue + num);
  }
}

// 入力フィールドの最後の文字を削除する関数
function clearInput() {
  const input = document.getElementById("priceInput");
  const newValue = input.value.replace(/,/g, '').slice(0, -1);
  input.value = formatNumberWithCommas(newValue);
}

// 入力フィールドと注文データを全てクリアする関数
function clearAllInput() {
  document.getElementById("priceInput").value = '';
  order = [];
  updateOrderList();
}
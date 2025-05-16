<?php
$host = 'localhost';
$dbname = 'yse_pos';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    // 受信確認：配列でなければエラー
    if (!is_array($data) || !isset($data[0]['price'])) {
        http_response_code(400);
        echo "受信データが不正です";
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO orders (price, quantity) VALUES (:price, :quantity)");
    $total = 0;

    foreach ($data as $item) {
        $price = $item['price'];
        $quantity = $item['quantity'];
        $stmt->execute([
            ':price' => $price,
            ':quantity' => $quantity
        ]);
        $total += $price * $quantity;
    }

    echo "注文が保存されました：¥" . number_format($total);
} catch (PDOException $e) {
    http_response_code(500);
    echo "エラー: " . $e->getMessage();
}

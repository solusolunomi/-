<?php
$host = 'localhost';
$dbname = 'yse_pos';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("INSERT INTO orders (price, quantity) VALUES (:price, :quantity)");
    foreach ($data as $item) {
        $stmt->execute($item);
    }

    echo "注文が保存されました";
} catch (PDOException $e) {
    echo "エラー: " . $e->getMessage();
}
?>
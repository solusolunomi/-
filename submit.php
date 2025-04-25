<?php
// データベース接続情報
$host = 'localhost';
$dbname = 'yse_pos';
$user = 'root';
$password = '';

try {
    // データベース接続を確立
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // クライアントから送信されたJSONデータを取得
    $data = json_decode(file_get_contents('php://input'), true);

    // データベースに注文データを挿入
    $stmt = $pdo->prepare("INSERT INTO orders (price, quantity) VALUES (:price, :quantity)");
    foreach ($data as $item) {
        $stmt->execute($item);
    }

    // 成功メッセージを返す
    echo "注文が保存されました";
} catch (PDOException $e) {
    // エラーメッセージを返す
    echo "エラー: " . $e->getMessage();
}